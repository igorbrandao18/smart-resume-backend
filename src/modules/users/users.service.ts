import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
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
    private usersRepository: Repository<User>,
    private mailService: MailService,
    private viaCEPService: ViaCEPService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.usersRepository.findOne({
      where: [
        { email: createUserDto.email },
        { phone: createUserDto.phone },
      ],
    });

    if (existingUser) {
      throw new BadRequestException('Email or phone already registered');
    }

    const user = this.usersRepository.create(createUserDto);
    user.verificationCode = this.generateVerificationCode();
    user.verificationCodeExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await this.usersRepository.save(user);
    await this.mailService.sendVerificationEmail(user.email, user.verificationCode);

    return user;
  }

  async verifyEmail(userId: string, verifyEmailDto: VerifyEmailDto): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.emailVerified) {
      throw new BadRequestException('Email already verified');
    }

    if (
      !user.verificationCode ||
      !user.verificationCodeExpires ||
      user.verificationCode !== verifyEmailDto.code ||
      user.verificationCodeExpires < new Date()
    ) {
      throw new BadRequestException('Invalid or expired verification code');
    }

    user.emailVerified = true;
    user.verificationCode = undefined;
    user.verificationCodeExpires = undefined;

    await this.usersRepository.save(user);
    await this.mailService.sendWelcomeEmail(user.email, user.name);

    return user;
  }

  async update(userId: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('User not found');
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

  async resendVerificationCode(resendCodeDto: ResendCodeDto): Promise<void> {
    const user = await this.usersRepository.findOne({
      where: { email: resendCodeDto.email }
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.emailVerified) {
      throw new BadRequestException('Email already verified');
    }

    user.verificationCode = this.generateVerificationCode();
    user.verificationCodeExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await this.usersRepository.save(user);
    await this.mailService.sendVerificationEmail(user.email, user.verificationCode);
  }

  private generateVerificationCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  async findOne(id: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { id } });
  }

  async validateAvailability(email?: string, phone?: string): Promise<{ available: boolean }> {
    if (!email && !phone) {
      throw new BadRequestException('Email or phone is required');
    }

    const whereCondition: { email?: string; phone?: string }[] = [];
    if (email) whereCondition.push({ email });
    if (phone) whereCondition.push({ phone });

    const existingUser = await this.usersRepository.findOne({
      where: whereCondition,
    });

    return { available: !existingUser };
  }
} 