import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { MailService } from './mail.service';
import * as nodemailer from 'nodemailer';
import { vi, describe, it, expect, beforeEach } from 'vitest';

vi.mock('nodemailer');

describe('MailService', () => {
  let service: MailService;
  let mockTransporter: any;

  const mockConfigService = {
    get: vi.fn((key: string) => {
      const config = {
        'mail.host': 'smtp.test.com',
        'mail.port': 587,
        'mail.auth.user': 'test@test.com',
        'mail.auth.pass': 'password',
      };
      return config[key];
    }),
  };

  beforeEach(async () => {
    mockTransporter = {
      sendMail: vi.fn().mockResolvedValue(true),
    };

    vi.spyOn(nodemailer, 'createTransport').mockReturnValue(mockTransporter);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MailService,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<MailService>(MailService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('sendVerificationEmail', () => {
    it('should send verification email successfully', async () => {
      const to = 'test@example.com';
      const code = '123456';

      await service.sendVerificationEmail(to, code);

      expect(mockTransporter.sendMail).toHaveBeenCalledWith(
        expect.objectContaining({
          from: 'test@test.com',
          to,
          subject: 'Verificação de Email',
          html: expect.stringContaining(code),
        }),
      );
    });

    it('should throw error when sending fails', async () => {
      const error = new Error('Failed to send email');
      mockTransporter.sendMail.mockRejectedValue(error);

      await expect(
        service.sendVerificationEmail('test@example.com', '123456'),
      ).rejects.toThrow(error);
    });
  });

  describe('sendWelcomeEmail', () => {
    it('should send welcome email successfully', async () => {
      const to = 'test@example.com';
      const name = 'Test User';

      await service.sendWelcomeEmail(to, name);

      expect(mockTransporter.sendMail).toHaveBeenCalledWith(
        expect.objectContaining({
          from: 'test@test.com',
          to,
          subject: 'Bem-vindo!',
          html: expect.stringContaining(name),
        }),
      );
    });

    it('should throw error when sending fails', async () => {
      const error = new Error('Failed to send email');
      mockTransporter.sendMail.mockRejectedValue(error);

      await expect(
        service.sendWelcomeEmail('test@example.com', 'Test User'),
      ).rejects.toThrow(error);
    });
  });
}); 