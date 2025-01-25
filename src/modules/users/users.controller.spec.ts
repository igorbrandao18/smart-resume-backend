import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { ViaCEPService } from '../../shared/services/viacep.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { ResendCodeDto } from './dto/resend-code.dto';
import { User } from './entities/user.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { vi, describe, it, expect, beforeEach } from 'vitest';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;
  let viaCepService: ViaCEPService;

  const mockUsersService = {
    create: vi.fn(),
    findOne: vi.fn(),
    verifyEmail: vi.fn(),
    update: vi.fn(),
    resendVerificationCode: vi.fn(),
    validateAvailability: vi.fn(),
  };

  const mockViaCepService = {
    getAddressByCEP: vi.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: ViaCEPService,
          useValue: mockViaCepService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
    viaCepService = module.get<ViaCEPService>(ViaCEPService);

    vi.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    const createUserDto: CreateUserDto = {
      name: 'John Doe',
      email: 'john@example.com',
      phone: '(11) 99999-9999',
    };

    it('should create a user successfully', async () => {
      const user = new User();
      Object.assign(user, createUserDto);
      vi.spyOn(service, 'create').mockResolvedValue(user);

      const result = await controller.create(createUserDto);

      expect(result).toBeDefined();
      expect(result.email).toBe(createUserDto.email);
      expect(service.create).toHaveBeenCalledWith(createUserDto);
    });

    it('should throw BadRequestException when service throws', async () => {
      vi.spyOn(service, 'create').mockRejectedValue(new BadRequestException());

      await expect(controller.create(createUserDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('verifyEmail', () => {
    const verifyEmailDto: VerifyEmailDto = {
      code: '123456',
    };

    it('should verify email successfully', async () => {
      const user = new User();
      user.id = '123';
      user.emailVerified = true;
      vi.spyOn(service, 'verifyEmail').mockResolvedValue(user);

      const result = await controller.verifyEmail('123', verifyEmailDto);

      expect(result).toBeDefined();
      expect(result.emailVerified).toBe(true);
      expect(service.verifyEmail).toHaveBeenCalledWith('123', { code: '123456' });
    });

    it('should throw BadRequestException when service throws', async () => {
      vi.spyOn(service, 'verifyEmail').mockRejectedValue(new BadRequestException());

      await expect(controller.verifyEmail('123', verifyEmailDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('update', () => {
    const updateUserDto: UpdateUserDto = {
      secondaryEmail: 'john.secondary@example.com',
      zipCode: '12345-678',
    };

    it('should update user successfully', async () => {
      const user = new User();
      user.id = '123';
      Object.assign(user, updateUserDto);
      vi.spyOn(service, 'update').mockResolvedValue(user);

      const result = await controller.update('123', updateUserDto);

      expect(result).toBeDefined();
      expect(result.secondaryEmail).toBe(updateUserDto.secondaryEmail);
      expect(service.update).toHaveBeenCalledWith('123', updateUserDto);
    });

    it('should throw NotFoundException when service throws', async () => {
      vi.spyOn(service, 'update').mockRejectedValue(new NotFoundException());

      await expect(controller.update('123', updateUserDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('resendVerificationCode', () => {
    const resendCodeDto: ResendCodeDto = {
      email: 'john@example.com',
    };

    it('should resend verification code successfully', async () => {
      vi.spyOn(service, 'resendVerificationCode').mockResolvedValue(undefined);

      await controller.resendVerificationCode(resendCodeDto);

      expect(service.resendVerificationCode).toHaveBeenCalledWith(resendCodeDto);
    });

    it('should throw BadRequestException when service throws', async () => {
      vi.spyOn(service, 'resendVerificationCode').mockRejectedValue(new BadRequestException());

      await expect(controller.resendVerificationCode(resendCodeDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('validate', () => {
    it('should validate email availability successfully', async () => {
      vi.spyOn(service, 'validateAvailability').mockResolvedValue({ available: true });

      const result = await controller.validate('test@example.com', undefined);

      expect(result.available).toBe(true);
      expect(service.validateAvailability).toHaveBeenCalledWith('test@example.com', undefined);
    });

    it('should validate phone availability successfully', async () => {
      vi.spyOn(service, 'validateAvailability').mockResolvedValue({ available: true });

      const result = await controller.validate(undefined, '(11) 99999-9999');

      expect(result.available).toBe(true);
      expect(service.validateAvailability).toHaveBeenCalledWith(undefined, '(11) 99999-9999');
    });

    it('should throw BadRequestException when no email or phone provided', async () => {
      vi.spyOn(service, 'validateAvailability').mockRejectedValue(new BadRequestException());

      await expect(controller.validate(undefined, undefined)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('getAddressByCEP', () => {
    it('should get address by CEP successfully', async () => {
      const address = {
        logradouro: 'Rua Exemplo',
        bairro: 'Centro',
        localidade: 'São Paulo',
        uf: 'SP',
      };

      vi.spyOn(viaCepService, 'getAddressByCEP').mockResolvedValue(address);

      const result = await controller.getAddressByCEP('12345-678');

      expect(result).toEqual(address);
      expect(viaCepService.getAddressByCEP).toHaveBeenCalledWith('12345-678');
    });

    it('should throw NotFoundException when service throws', async () => {
      vi.spyOn(viaCepService, 'getAddressByCEP').mockRejectedValue(new NotFoundException());

      await expect(controller.getAddressByCEP('12345-678')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
}); 