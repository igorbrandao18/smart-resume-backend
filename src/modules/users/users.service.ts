import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { ResendCodeDto } from './dto/resend-code.dto';
import { MailService } from '../../shared/services/mail.service';
import { ViaCEPService } from '../../shared/services/viacep.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly mailService: MailService,
    private readonly viaCEPService: ViaCEPService,
  ) {}

  private generateVerificationCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  private setVerificationCode(user: User): void {
    user.verificationCode = this.generateVerificationCode();
    user.verificationCodeExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.usersRepository.findOne({
      where: [
        { email: createUserDto.email },
        { phone: createUserDto.phone },
      ],
    });

    if (existingUser) {
      throw new BadRequestException('Email ou telefone já cadastrado');
    }

    const user = this.usersRepository.create(createUserDto);
    this.setVerificationCode(user);
    await this.usersRepository.save(user);

    await this.mailService.sendVerificationEmail(user.email, user.verificationCode);

    return user;
  }

  async validateAvailability(email?: string, phone?: string): Promise<{ available: boolean }> {
    if (!email && !phone) {
      throw new BadRequestException('Email ou telefone é necessário');
    }

    const query = this.usersRepository.createQueryBuilder('user');
    
    if (email) {
      query.orWhere('user.email = :email', { email });
    }
    
    if (phone) {
      query.orWhere('user.phone = :phone', { phone });
    }

    const existingUser = await query.getOne();
    return { available: !existingUser };
  }

  async findOne(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }
    return user;
  }

  async verifyEmail(id: string, verifyEmailDto: VerifyEmailDto): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    if (user.emailVerified) {
      throw new BadRequestException('Email já verificado');
    }

    if (!user.verificationCode || !user.verificationCodeExpires) {
      throw new BadRequestException('Código de verificação não encontrado');
    }

    if (user.verificationCode !== verifyEmailDto.code) {
      throw new BadRequestException('Código de verificação inválido');
    }

    if (user.verificationCodeExpires < new Date()) {
      throw new BadRequestException('Código de verificação expirado');
    }

    user.emailVerified = true;
    user.verificationCode = null;
    user.verificationCodeExpires = null;

    await this.usersRepository.save(user);
    await this.mailService.sendWelcomeEmail(user.email, user.name);

    return user;
  }

  async resendVerificationCode(resendCodeDto: ResendCodeDto): Promise<void> {
    const user = await this.usersRepository.findOne({
      where: { email: resendCodeDto.email },
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    if (user.emailVerified) {
      throw new BadRequestException('Email já verificado');
    }

    this.setVerificationCode(user);
    await this.usersRepository.save(user);

    await this.mailService.sendVerificationEmail(user.email, user.verificationCode);
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    if (!user.emailVerified) {
      throw new BadRequestException('Email não verificado');
    }

    if (updateUserDto.zipCode) {
      const address = await this.viaCEPService.getAddressByCEP(updateUserDto.zipCode);
      Object.assign(updateUserDto, {
        street: address.logradouro,
        neighborhood: address.bairro,
        city: address.localidade,
        state: address.uf,
      });
    }

    Object.assign(user, updateUserDto);
    return this.usersRepository.save(user);
  }
} 