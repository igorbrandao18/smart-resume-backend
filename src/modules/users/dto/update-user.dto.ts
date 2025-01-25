import { IsString, IsEmail, IsOptional, Length, Matches, IsLatitude, IsLongitude } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiPropertyOptional({
    description: 'Email secundário do usuário',
    example: 'joao.trabalho@exemplo.com'
  })
  @IsOptional()
  @IsEmail({}, { message: 'Email secundário inválido' })
  secondaryEmail?: string;

  @ApiPropertyOptional({
    description: 'CNPJ do usuário',
    example: '12345678901234'
  })
  @IsOptional()
  @Length(14, 14, { message: 'O CNPJ deve ter 14 dígitos' })
  @Matches(/^\d{14}$/, { message: 'CNPJ inválido' })
  cnpj?: string;

  @ApiPropertyOptional({
    description: 'Nome da rua',
    example: 'Praça da Sé'
  })
  @IsOptional()
  @IsString({ message: 'A rua deve ser uma string' })
  street?: string;

  @ApiPropertyOptional({
    description: 'Número do endereço',
    example: '1'
  })
  @IsOptional()
  @IsString({ message: 'O número deve ser uma string' })
  number?: string;

  @ApiPropertyOptional({
    description: 'Nome do bairro',
    example: 'Sé'
  })
  @IsOptional()
  @IsString({ message: 'O bairro deve ser uma string' })
  neighborhood?: string;

  @ApiPropertyOptional({
    description: 'Nome da cidade',
    example: 'São Paulo'
  })
  @IsOptional()
  @IsString({ message: 'A cidade deve ser uma string' })
  city?: string;

  @ApiPropertyOptional({
    description: 'Sigla do estado',
    example: 'SP'
  })
  @IsOptional()
  @Length(2, 2, { message: 'O estado deve ter 2 caracteres' })
  @Matches(/^[A-Z]{2}$/, { message: 'Estado inválido' })
  state?: string;

  @ApiPropertyOptional({
    description: 'CEP do endereço',
    example: '01001000'
  })
  @IsOptional()
  @Length(8, 8, { message: 'O CEP deve ter 8 dígitos' })
  @Matches(/^\d{8}$/, { message: 'CEP inválido' })
  zipCode?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsLatitude()
  latitude?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsLongitude()
  longitude?: number;
} 