import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Mailgen from 'mailgen';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private transporter: nodemailer.Transporter;
  private mailgen: Mailgen;

  constructor(private readonly config: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.config.get<string>('MAILTRAP_SMTP_HOST'),
      port: this.config.get<number>('MAILTRAP_SMTP_PORT'),
      auth: {
        user: this.config.get<string>('MAILTRAP_SMTP_USER'),
        pass: this.config.get<string>('MAILTRAP_SMTP_PASSWORD'),
      },
    });

    this.mailgen = new Mailgen({
      theme: 'default',
      product: {
        name: 'Workflow Builder',
        link: this.config.get<string>('APP_URL') ?? 'http://localhost:3005',
      },
    });
  }

  async sendVerificationEmail(
    to: string,
    name: string,
    verificationUrl: string,
  ): Promise<void> {
    const email: Mailgen.Content = {
      body: {
        name: name || to,
        intro: 'Welcome to Workflow Builder! Please verify your email address to get started.',
        action: {
          instructions: 'Click the button below to verify your email. This link expires in 24 hours.',
          button: {
            color: '#4F46E5',
            text: 'Verify Email Address',
            link: verificationUrl,
          },
        },
        outro: 'If you did not create an account, you can safely ignore this email.',
      },
    };

    const html = this.mailgen.generate(email);
    const text = this.mailgen.generatePlaintext(email);

    await this.transporter.sendMail({
      from: this.config.get<string>('MAIL_FROM'),
      to,
      subject: 'Verify your email – Workflow Builder',
      html,
      text,
    });

    this.logger.log(`Verification email sent to ${to}`);
  }

  async sendPasswordResetEmail(to: string, name: string, resetUrl: string): Promise<void> {
    const email: Mailgen.Content = {
      body: {
        name: name || to,
        intro: 'You requested a password reset for your Workflow Builder account.',
        action: {
          instructions: 'Click the button below to reset your password. This link expires in 1 hour.',
          button: {
            color: '#4F46E5',
            text: 'Reset Password',
            link: resetUrl,
          },
        },
        outro: 'If you did not request a password reset, you can safely ignore this email.',
      },
    };

    const html = this.mailgen.generate(email);
    const text = this.mailgen.generatePlaintext(email);

    await this.transporter.sendMail({
      from: this.config.get<string>('MAIL_FROM'),
      to,
      subject: 'Reset your password – Workflow Builder',
      html,
      text,
    });

    this.logger.log(`Password reset email sent to ${to}`);
  }
}
