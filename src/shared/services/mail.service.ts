import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    const host = this.configService.get<string>('MAIL_HOST');
    const port = this.configService.get<number>('MAIL_PORT');
    const user = this.configService.get<string>('MAIL_USER');
    const pass = this.configService.get<string>('MAIL_PASS');

    if (!host || !port || !user || !pass) {
      throw new Error('Mail configuration not found');
    }

    this.transporter = nodemailer.createTransport({
      host,
      port,
      auth: {
        user,
        pass,
      },
    });
  }

  async sendVerificationEmail(to: string, code: string): Promise<void> {
    const user = this.configService.get<string>('MAIL_USER');
    if (!user) {
      throw new Error('Mail configuration not found');
    }

    await this.transporter.sendMail({
      from: user,
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
    const user = this.configService.get<string>('MAIL_USER');
    if (!user) {
      throw new Error('Mail configuration not found');
    }

    await this.transporter.sendMail({
      from: user,
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