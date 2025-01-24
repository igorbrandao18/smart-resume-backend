import { IsString, IsEmail, IsOptional, Length, Matches, IsNotEmpty } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'João Silva' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'joao@email.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '(11) 99999-9999' })
  @IsString()
  @Matches(/^\(\d{2}\) \d{5}-\d{4}$/, {
    message: 'Phone must be in format (99) 99999-9999',
  })
  phone: string;
} 