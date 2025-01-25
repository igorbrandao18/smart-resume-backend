import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { MailService } from '../../shared/services/mail.service';
import { ViaCEPService } from '../../shared/services/viacep.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { vi, describe, it, expect, beforeEach } from 'vitest';

describe('UsersService', () => {
  let service: UsersService;
  let repository: Repository<User>;
  let mailService: MailService;
  let viaCepService: ViaCEPService;

  const mockRepository = {
    create: vi.fn(),
    save: vi.fn(),
    findOne: vi.fn(),
    update: vi.fn(),
  };

  const mockMailService = {
    sendVerificationEmail: vi.fn(),
    sendWelcomeEmail: vi.fn(),
  };

  const mockViaCepService = {
    getAddressByCEP: vi.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository,
        },
        {
          provide: MailService,
          useValue: mockMailService,
        },
        {
          provide: ViaCEPService,
          useValue: mockViaCepService,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
    mailService = module.get<MailService>(MailService);
    viaCepService = module.get<ViaCEPService>(ViaCEPService);

    // Clear all mocks before each test
    vi.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const createUserDto: CreateUserDto = {
      name: 'John Doe',
      email: 'john@example.com',
      phone: '(11) 99999-9999',
    };

    it('should create a new user successfully', async () => {
      const user = new User();
      Object.assign(user, createUserDto);
      
      vi.spyOn(repository, 'findOne').mockResolvedValue(null);
      vi.spyOn(repository, 'create').mockReturnValue(user);
      vi.spyOn(repository, 'save').mockResolvedValue(user);
      vi.spyOn(mockMailService, 'sendVerificationEmail').mockResolvedValue(undefined);

      const result = await service.create(createUserDto);

      expect(result).toBeDefined();
      expect(result.email).toBe(createUserDto.email);
      expect(result.verificationCode).toBeDefined();
      expect(result.verificationCodeExpires).toBeDefined();
      expect(mockMailService.sendVerificationEmail).toHaveBeenCalledWith(
        user.email,
        result.verificationCode,
      );
    });

    it('should throw BadRequestException if email already exists', async () => {
      vi.spyOn(repository, 'findOne').mockResolvedValue(new User());

      await expect(service.create(createUserDto)).rejects.toThrow(
        BadRequestException,
      );
      expect(mockMailService.sendVerificationEmail).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException if phone already exists', async () => {
      vi.spyOn(repository, 'findOne').mockResolvedValue(new User());

      await expect(service.create(createUserDto)).rejects.toThrow(
        BadRequestException,
      );
      expect(mockMailService.sendVerificationEmail).not.toHaveBeenCalled();
    });
  });

  describe('verifyEmail', () => {
    it('should verify email successfully', async () => {
      const user = new User();
      user.id = '123';
      user.verificationCode = '123456';
      user.verificationCodeExpires = new Date(Date.now() + 1000 * 60);
      user.emailVerified = false;

      vi.spyOn(repository, 'findOne').mockResolvedValue(user);
      vi.spyOn(repository, 'save').mockResolvedValue({ ...user, emailVerified: true });
      vi.spyOn(mockMailService, 'sendWelcomeEmail').mockResolvedValue(undefined);

      const result = await service.verifyEmail(user.id, { code: '123456' });

      expect(result.emailVerified).toBe(true);
      expect(result.verificationCode).toBeUndefined();
      expect(result.verificationCodeExpires).toBeUndefined();
      expect(mockMailService.sendWelcomeEmail).toHaveBeenCalledWith(
        user.email,
        user.name,
      );
    });

    it('should throw BadRequestException if code is invalid', async () => {
      const user = new User();
      user.verificationCode = '123456';
      user.verificationCodeExpires = new Date(Date.now() + 1000 * 60);
      
      vi.spyOn(repository, 'findOne').mockResolvedValue(user);

      await expect(
        service.verifyEmail('123', { code: 'wrong' }),
      ).rejects.toThrow(BadRequestException);
      expect(mockMailService.sendWelcomeEmail).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException if code is expired', async () => {
      const user = new User();
      user.verificationCode = '123456';
      user.verificationCodeExpires = new Date(Date.now() - 1000 * 60);
      
      vi.spyOn(repository, 'findOne').mockResolvedValue(user);

      await expect(
        service.verifyEmail('123', { code: '123456' }),
      ).rejects.toThrow(BadRequestException);
      expect(mockMailService.sendWelcomeEmail).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException if email already verified', async () => {
      const user = new User();
      user.emailVerified = true;
      
      vi.spyOn(repository, 'findOne').mockResolvedValue(user);

      await expect(
        service.verifyEmail('123', { code: '123456' }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('update', () => {
    const updateUserDto: UpdateUserDto = {
      secondaryEmail: 'john.secondary@example.com',
      zipCode: '12345-678',
    };

    it('should update user successfully with address from ViaCEP', async () => {
      const user = new User();
      user.id = '123';
      
      const viaCepResponse = {
        logradouro: 'Rua Exemplo',
        bairro: 'Centro',
        localidade: 'São Paulo',
        uf: 'SP',
      };

      vi.spyOn(repository, 'findOne').mockResolvedValue(user);
      vi.spyOn(viaCepService, 'getAddressByCEP').mockResolvedValue(viaCepResponse);
      vi.spyOn(repository, 'save').mockResolvedValue({
        ...user,
        ...updateUserDto,
        street: viaCepResponse.logradouro,
        neighborhood: viaCepResponse.bairro,
        city: viaCepResponse.localidade,
        state: viaCepResponse.uf,
      });

      const result = await service.update(user.id, updateUserDto);

      expect(result.secondaryEmail).toBe(updateUserDto.secondaryEmail);
      expect(result.street).toBe(viaCepResponse.logradouro);
      expect(result.city).toBe(viaCepResponse.localidade);
      expect(result.state).toBe(viaCepResponse.uf);
      expect(viaCepService.getAddressByCEP).toHaveBeenCalledWith(updateUserDto.zipCode);
    });

    it('should throw NotFoundException if user not found', async () => {
      vi.spyOn(repository, 'findOne').mockResolvedValue(null);

      await expect(service.update('123', updateUserDto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should update only provided fields', async () => {
      const user = new User();
      user.id = '123';
      user.email = 'existing@example.com';
      
      vi.spyOn(repository, 'findOne').mockResolvedValue(user);
      vi.spyOn(repository, 'save').mockResolvedValue({ ...user, secondaryEmail: 'new@example.com' });

      const result = await service.update(user.id, { secondaryEmail: 'new@example.com' });

      expect(result.email).toBe('existing@example.com');
      expect(result.secondaryEmail).toBe('new@example.com');
    });

    it('should handle ViaCEP service errors', async () => {
      const user = new User();
      vi.spyOn(repository, 'findOne').mockResolvedValue(user);
      vi.spyOn(viaCepService, 'getAddressByCEP').mockRejectedValue(new Error());

      await expect(
        service.update('123', { zipCode: '12345-678' }),
      ).rejects.toThrow();
    });
  });

  describe('resendVerificationCode', () => {
    it('should resend verification code successfully', async () => {
      const user = new User();
      user.email = 'john@example.com';
      user.emailVerified = false;

      vi.spyOn(repository, 'findOne').mockResolvedValue(user);
      vi.spyOn(repository, 'save').mockResolvedValue({ ...user, verificationCode: expect.any(String), verificationCodeExpires: expect.any(Date) });
      vi.spyOn(mockMailService, 'sendVerificationEmail').mockResolvedValue(undefined);

      await service.resendVerificationCode({ email: user.email });

      expect(user.verificationCode).toBeDefined();
      expect(user.verificationCodeExpires).toBeDefined();
      expect(mockMailService.sendVerificationEmail).toHaveBeenCalledWith(
        user.email,
        user.verificationCode,
      );
    });

    it('should throw BadRequestException if email already verified', async () => {
      const user = new User();
      user.emailVerified = true;

      vi.spyOn(repository, 'findOne').mockResolvedValue(user);

      await expect(
        service.resendVerificationCode({ email: 'john@example.com' }),
      ).rejects.toThrow(BadRequestException);
      expect(mockMailService.sendVerificationEmail).not.toHaveBeenCalled();
    });
  });

  describe('validateAvailability', () => {
    it('should return available true when email and phone not found', async () => {
      vi.spyOn(repository, 'findOne').mockResolvedValue(null);

      const result = await service.validateAvailability('test@example.com', '(11) 99999-9999');

      expect(result.available).toBe(true);
    });

    it('should return available false when email found', async () => {
      vi.spyOn(repository, 'findOne').mockResolvedValue(new User());

      const result = await service.validateAvailability('test@example.com');

      expect(result.available).toBe(false);
    });

    it('should throw BadRequestException when no email or phone provided', async () => {
      await expect(service.validateAvailability()).rejects.toThrow(
        BadRequestException,
      );
    });
  });
}); 