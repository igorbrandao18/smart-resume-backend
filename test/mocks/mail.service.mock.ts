import { Injectable } from '@nestjs/common';

@Injectable()
export class MockMailService {
  async sendVerificationEmail(email: string, code: string): Promise<void> {
    // Mock implementation
    console.log(`Sending verification email to ${email} with code ${code}`);
  }

  async sendWelcomeEmail(email: string, name: string): Promise<void> {
    // Mock implementation
    console.log(`Sending welcome email to ${email} for user ${name}`);
  }
} 