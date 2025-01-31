import { Controller, Post, Body, Param, Put, HttpCode, HttpStatus, Get, NotFoundException, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { ResendCodeDto } from './dto/resend-code.dto';
import { User } from './entities/user.entity';
import { ViaCEPService, ViaCEPResponse } from '../../shared/services/viacep.service';
import { CNPJWSService, CNPJWSResponse } from '../../shared/services/cnpj-ws.service';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly viaCEPService: ViaCEPService,
    private readonly cnpjWSService: CNPJWSService
  ) {}

  @Post()
  @ApiOperation({ 
    summary: 'Criar um novo usuário',
    description: 'Cria um novo usuário com nome, email e telefone. Um código de verificação será enviado para o email.'
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Usuário criado com sucesso',
    type: User,
    schema: {
      example: {
        id: '123e4567-e89b-12d3-a456-426614174000',
        name: 'João Silva',
        email: 'joao.silva@exemplo.com',
        phone: '11999999999',
        emailVerified: false,
        createdAt: '2024-01-24T22:38:00.000Z',
        updatedAt: '2024-01-24T22:38:00.000Z'
      }
    }
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Dados inválidos ou email/telefone já cadastrado'
  })
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

  @Get('cnpj/:cnpj')
  @ApiOperation({ summary: 'Get company data by CNPJ' })
  @ApiParam({
    name: 'cnpj',
    description: 'CNPJ da empresa (com ou sem caracteres especiais)',
    example: '41.305.206/0001-07'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Company data found',
    type: CNPJWSResponse
  })
  @ApiResponse({ status: 404, description: 'CNPJ not found' })
  @ApiResponse({ status: 400, description: 'Invalid CNPJ' })
  @ApiResponse({ status: 429, description: 'Too many requests - Rate limit exceeded' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async getCNPJData(@Param('cnpj') cnpj: string): Promise<Partial<CNPJWSResponse>> {
    return this.cnpjWSService.getCNPJData(cnpj);
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

  @Post('verify-email/:id')
  @ApiOperation({ summary: 'Verificar email do usuário' })
  @ApiParam({ 
    name: 'id', 
    description: 'ID do usuário' 
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Email verificado com sucesso',
    type: User 
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Código inválido' 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Usuário não encontrado' 
  })
  async verifyEmail(
    @Param('id') id: string,
    @Body() verifyEmailDto: VerifyEmailDto,
  ): Promise<User> {
    return this.usersService.verifyEmail(id, verifyEmailDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Atualizar informações do usuário' })
  @ApiParam({ 
    name: 'id', 
    description: 'ID do usuário' 
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Usuário atualizado com sucesso',
    type: User 
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Dados inválidos' 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Usuário não encontrado' 
  })
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return this.usersService.update(id, updateUserDto);
  }
} 