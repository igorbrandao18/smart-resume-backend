import { IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResendCodeDto {
  @ApiProperty({ example: 'joao@email.com' })
  @IsEmail()
  email: string;
} 