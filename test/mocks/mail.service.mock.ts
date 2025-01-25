import { Injectable } from '@nestjs/common';

@Injectable()
export class MockMailService {
  async sendVerificationEmail(to: string, code: string): Promise<void> {
    // Mock implementation
    console.log(`Sending verification email to ${to} with code ${code}`);
  }

  async sendWelcomeEmail(to: string, name: string): Promise<void> {
    // Mock implementation
    console.log(`Sending welcome email to ${to} for user ${name}`);
  }
} 