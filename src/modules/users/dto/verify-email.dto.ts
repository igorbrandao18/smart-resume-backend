import { IsNotEmpty, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class VerifyEmailDto {
  @ApiProperty({
    description: 'Código de verificação enviado por email',
    example: '123456',
    minLength: 6,
    maxLength: 6
  })
  @IsNotEmpty({ message: 'O código é obrigatório' })
  @IsString({ message: 'O código deve ser uma string' })
  @Length(6, 6, { message: 'O código deve ter 6 dígitos' })
  code: string;
} 