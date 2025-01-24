import { Controller, Post, Body, Param, Put, HttpCode, HttpStatus, Get, NotFoundException, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { ResendCodeDto } from './dto/resend-code.dto';
import { User } from './entities/user.entity';
import { ViaCEPService, ViaCEPResponse } from '../../shared/services/viacep.service';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly viaCEPService: ViaCEPService
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ status: 201, description: 'User created successfully', type: User })
  @ApiResponse({ status: 400, description: 'Bad request - Email or phone already registered' })
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.create(createUserDto);
  }

  @Get('validate')
  @ApiOperation({ summary: 'Validate email or phone availability' })
  @ApiResponse({ status: 200, description: 'Returns if email/phone is available' })
  @ApiResponse({ status: 400, description: 'Bad request - Email or phone is required' })
  async validate(
    @Query('email') email?: string,
    @Query('phone') phone?: string,
  ): Promise<{ available: boolean }> {
    return this.usersService.validateAvailability(email, phone);
  }

  @Get('address/:cep')
  @ApiOperation({ summary: 'Get address by CEP' })
  @ApiResponse({ status: 200, description: 'Address found' })
  @ApiResponse({ status: 404, description: 'CEP not found' })
  async getAddressByCEP(@Param('cep') cep: string): Promise<Partial<ViaCEPResponse>> {
    return this.viaCEPService.getAddressByCEP(cep);
  }

  @Post('resend-verification')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Resend verification code' })
  @ApiResponse({ status: 200, description: 'Verification code sent successfully' })
  @ApiResponse({ status: 400, description: 'Bad request - Email already verified' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async resendVerificationCode(@Body() resendCodeDto: ResendCodeDto): Promise<void> {
    await this.usersService.resendVerificationCode(resendCodeDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiResponse({ status: 200, description: 'User found', type: User })
  @ApiResponse({ status: 404, description: 'User not found' })
  async findOne(@Param('id') id: string): Promise<User> {
    const user = await this.usersService.findOne(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  @Post(':id/verify-email')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verify user email' })
  @ApiResponse({ status: 200, description: 'Email verified successfully', type: User })
  @ApiResponse({ status: 400, description: 'Invalid or expired verification code' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async verifyEmail(
    @Param('id') id: string,
    @Body() verifyEmailDto: VerifyEmailDto,
  ): Promise<User> {
    return this.usersService.verifyEmail(id, verifyEmailDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update user information' })
  @ApiResponse({ status: 200, description: 'User updated successfully', type: User })
  @ApiResponse({ status: 400, description: 'Bad request - Invalid data format' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return this.usersService.update(id, updateUserDto);
  }
} 