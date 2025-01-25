import { IsEmail, IsNotEmpty, IsString, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    description: 'Nome completo do usuário',
    example: 'João Silva'
  })
  @IsNotEmpty({ message: 'O nome é obrigatório' })
  @IsString({ message: 'O nome deve ser uma string' })
  name: string;

  @ApiProperty({
    description: 'Email do usuário',
    example: 'joao.silva@exemplo.com'
  })
  @IsNotEmpty({ message: 'O email é obrigatório' })
  @IsEmail({}, { message: 'Email inválido' })
  email: string;

  @ApiProperty({
    description: 'Número de celular do usuário',
    example: '11999999999'
  })
  @IsNotEmpty({ message: 'O celular é obrigatório' })
  @Matches(/^[1-9]{2}[0-9]{9}$/, {
    message: 'O celular deve estar no formato 11999999999'
  })
  phone: string;
} 