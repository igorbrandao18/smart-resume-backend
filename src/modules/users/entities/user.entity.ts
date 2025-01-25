import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Exclude } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

@Entity('users')
export class User {
  @ApiProperty({
    description: 'ID único do usuário',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'Nome completo do usuário',
    example: 'João Silva'
  })
  @Column({ type: 'varchar' })
  name: string;

  @ApiProperty({
    description: 'Email principal do usuário',
    example: 'joao.silva@exemplo.com'
  })
  @Column({ type: 'varchar', unique: true })
  email: string;

  @ApiProperty({
    description: 'Número de celular do usuário',
    example: '11999999999'
  })
  @Column({ type: 'varchar', unique: true })
  phone: string;

  @ApiPropertyOptional({
    description: 'Email secundário do usuário',
    example: 'joao.trabalho@exemplo.com'
  })
  @Column({ type: 'varchar', nullable: true })
  secondaryEmail?: string;

  @ApiPropertyOptional({
    description: 'CNPJ do usuário',
    example: '12345678901234'
  })
  @Column({ type: 'varchar', nullable: true })
  cnpj?: string;

  @ApiPropertyOptional({
    description: 'CEP do endereço',
    example: '01001000'
  })
  @Column({ type: 'varchar', nullable: true })
  zipCode?: string;

  @ApiPropertyOptional({
    description: 'Nome da rua',
    example: 'Praça da Sé'
  })
  @Column({ type: 'varchar', nullable: true })
  street?: string;

  @ApiPropertyOptional({
    description: 'Número do endereço',
    example: '1'
  })
  @Column({ type: 'varchar', nullable: true })
  number?: string;

  @ApiPropertyOptional({
    description: 'Nome do bairro',
    example: 'Sé'
  })
  @Column({ type: 'varchar', nullable: true })
  neighborhood?: string;

  @ApiPropertyOptional({
    description: 'Nome da cidade',
    example: 'São Paulo'
  })
  @Column({ type: 'varchar', nullable: true })
  city?: string;

  @ApiPropertyOptional({
    description: 'Sigla do estado',
    example: 'SP'
  })
  @Column({ type: 'varchar', nullable: true })
  state?: string;

  @Column({ type: 'decimal', precision: 10, scale: 8, nullable: true })
  latitude?: number;

  @Column({ type: 'decimal', precision: 11, scale: 8, nullable: true })
  longitude?: number;

  @ApiProperty({
    description: 'Indica se o email foi verificado',
    example: false
  })
  @Column({ type: 'boolean', default: false })
  emailVerified: boolean;

  @Exclude()
  @Column({ type: 'varchar', nullable: true })
  verificationCode?: string;

  @Exclude()
  @Column({ type: 'timestamp', nullable: true })
  verificationCodeExpires?: Date;

  @ApiProperty({
    description: 'Data de criação do registro',
    example: '2024-01-24T22:38:00.000Z'
  })
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @ApiProperty({
    description: 'Data da última atualização do registro',
    example: '2024-01-24T22:38:00.000Z'
  })
  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
} 