import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get('mail.host'),
      port: this.configService.get('mail.port'),
      auth: {
        user: this.configService.get('mail.auth.user'),
        pass: this.configService.get('mail.auth.pass'),
      },
    });
  }

  async sendVerificationEmail(to: string, code: string): Promise<void> {
    await this.transporter.sendMail({
      from: this.configService.get('mail.auth.user'),
      to,
      subject: 'Verificação de Email',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #2563eb; text-align: center;">Código de Verificação</h1>
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="text-align: center; font-size: 16px;">Use o código abaixo para verificar seu email:</p>
            <h2 style="text-align: center; font-size: 32px; letter-spacing: 4px; color: #1f2937;">${code}</h2>
          </div>
          <p style="color: #6b7280; text-align: center;">Este código expira em 10 minutos.</p>
          <p style="color: #6b7280; text-align: center; font-size: 14px;">
            Se você não solicitou este código, por favor ignore este email.
          </p>
        </div>
      `,
    });
  }

  async sendWelcomeEmail(to: string, name: string): Promise<void> {
    await this.transporter.sendMail({
      from: this.configService.get('mail.auth.user'),
      to,
      subject: 'Bem-vindo!',
      html: `
        <h1>Bem-vindo ${name}!</h1>
        <p>Seu cadastro foi concluído com sucesso.</p>
        <p>Agradecemos por se registrar em nossa plataforma.</p>
      `,
    });
  }
} 