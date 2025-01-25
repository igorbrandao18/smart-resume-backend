import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('mail.host'),
      port: this.configService.get<number>('mail.port'),
      auth: {
        user: this.configService.get<string>('mail.user'),
        pass: this.configService.get<string>('mail.pass'),
      },
    });
  }

  async sendVerificationEmail(email: string, code: string): Promise<void> {
    const mailOptions = {
      from: this.configService.get<string>('mail.user'),
      to: email,
      subject: 'Verificação de Email',
      html: `
        <h1>Bem-vindo ao Sistema de Cadastro</h1>
        <p>Para verificar seu email, use o código abaixo:</p>
        <h2 style="color: #4CAF50;">${code}</h2>
        <p>Este código expira em 15 minutos.</p>
        <p>Se você não solicitou este código, por favor ignore este email.</p>
      `,
    };

    await this.transporter.sendMail(mailOptions);
  }

  async sendWelcomeEmail(email: string, name: string): Promise<void> {
    const mailOptions = {
      from: this.configService.get<string>('mail.user'),
      to: email,
      subject: 'Bem-vindo ao Sistema',
      html: `
        <h1>Olá ${name}!</h1>
        <p>Seu email foi verificado com sucesso.</p>
        <p>Agora você pode completar seu cadastro com as informações adicionais.</p>
        <p>Obrigado por se cadastrar!</p>
      `,
    };

    await this.transporter.sendMail(mailOptions);
  }
} 