// src/modules/email/email.service.ts
import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: false,
    requireTLS: true, // true për 465, false për 587
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  async sendWelcomeEmail(email: string, name: string) {
    return this.transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: email,
      subject: 'Welcome 🎉',
      html: `
        <h2>Hello ${name}</h2>
        <p>Welcome to our platform!</p>
      `,
    });
  }

  async sendBookingConfirmation(email: string, bookingId: string) {
    return this.transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: email,
      subject: 'Booking Confirmed 🎉',
      html: `
        <h2>Your booking is confirmed</h2>
        <p>Booking ID: ${bookingId}</p>
      `,
    });
  }
}
