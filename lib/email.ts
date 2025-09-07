import nodemailer from "nodemailer";

// Email service configuration - Free alternatives supported
const EMAIL_CONFIG = {
  service: process.env.EMAIL_SERVICE || "mailgun", // Default to Mailgun (free tier available)
  host: process.env.EMAIL_HOST || "smtp.mailgun.org",
  port: parseInt(process.env.EMAIL_PORT || "587"),
  secure: process.env.EMAIL_SECURE === "true", // false for most services
  auth: {
    user: process.env.EMAIL_USER || "postmaster@sandbox.mailgun.org", // Mailgun default
    pass: process.env.EMAIL_PASS, // API key or password
  },
};

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    service: EMAIL_CONFIG.service,
    host: EMAIL_CONFIG.host,
    port: EMAIL_CONFIG.port,
    secure: EMAIL_CONFIG.secure,
    auth: EMAIL_CONFIG.auth,
  });
};

// Email templates
export const EMAIL_TEMPLATES = {
  PASSWORD_RESET: (resetUrl: string, userName: string) => ({
    subject: "Reset Your Password - CodeCollab",
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Reset Your Password</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>CodeCollab</h1>
            <h2>Password Reset Request</h2>
          </div>
          <div class="content">
            <p>Hello ${userName},</p>
            <p>You requested a password reset for your CodeCollab account.</p>
            <p>Click the button below to reset your password:</p>
            <a href="${resetUrl}" class="button">Reset Password</a>
            <p><strong>This link will expire in 10 minutes.</strong></p>
            <p>If you didn't request this password reset, please ignore this email. Your password will remain unchanged.</p>
            <p>For security reasons, please don't share this email with anyone.</p>
          </div>
          <div class="footer">
            <p>If the button doesn't work, copy and paste this link into your browser:</p>
            <p><a href="${resetUrl}">${resetUrl}</a></p>
            <p>&copy; 2024 CodeCollab. All rights reserved.</p>
          </div>
        </body>
      </html>
    `,
    text: `
      Hello ${userName},

      You requested a password reset for your CodeCollab account.

      Click this link to reset your password: ${resetUrl}

      This link will expire in 10 minutes.

      If you didn't request this password reset, please ignore this email.

      For security reasons, please don't share this email with anyone.

      CodeCollab Team
    `,
  }),

  EMAIL_VERIFICATION: (verificationUrl: string, userName: string) => ({
    subject: "Verify Your Email - CodeCollab",
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Verify Your Email</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>CodeCollab</h1>
            <h2>Verify Your Email</h2>
          </div>
          <div class="content">
            <p>Hello ${userName},</p>
            <p>Welcome to CodeCollab! Please verify your email address to complete your registration.</p>
            <p>Click the button below to verify your email:</p>
            <a href="${verificationUrl}" class="button">Verify Email</a>
            <p><strong>This link will expire in 24 hours.</strong></p>
            <p>If you didn't create an account, please ignore this email.</p>
          </div>
          <div class="footer">
            <p>If the button doesn't work, copy and paste this link into your browser:</p>
            <p><a href="${verificationUrl}">${verificationUrl}</a></p>
            <p>&copy; 2024 CodeCollab. All rights reserved.</p>
          </div>
        </body>
      </html>
    `,
    text: `
      Hello ${userName},

      Welcome to CodeCollab! Please verify your email address to complete your registration.

      Click this link to verify your email: ${verificationUrl}

      This link will expire in 24 hours.

      If you didn't create an account, please ignore this email.

      CodeCollab Team
    `,
  }),
};

// Send email function
export async function sendEmail({
  to,
  subject,
  html,
  text,
}: {
  to: string;
  subject: string;
  html: string;
  text: string;
}) {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: `"CodeCollab" <${EMAIL_CONFIG.auth.user}>`,
      to,
      subject,
      html,
      text,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully:", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Email sending failed:", error);
    throw new Error("Failed to send email");
  }
}

// Specialized functions for common emails
export async function sendPasswordResetEmail(
  email: string,
  resetToken: string,
  userName: string
) {
  const resetUrl = `${
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
  }/auth/reset-password?token=${resetToken}`;
  const template = EMAIL_TEMPLATES.PASSWORD_RESET(resetUrl, userName);

  return sendEmail({
    to: email,
    subject: template.subject,
    html: template.html,
    text: template.text,
  });
}

export async function sendEmailVerificationEmail(
  email: string,
  verificationToken: string,
  userName: string
) {
  const verificationUrl = `${
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
  }/auth/verify-email?token=${verificationToken}`;
  const template = EMAIL_TEMPLATES.EMAIL_VERIFICATION(
    verificationUrl,
    userName
  );

  return sendEmail({
    to: email,
    subject: template.subject,
    html: template.html,
    text: template.text,
  });
}
