import "server-only";

import { createTransport } from "nodemailer";

const transporter = createTransport({
  host: process.env.BREVO_HOST,
  port: parseInt(process.env.BREVO_PORT as string),
  secure: false,
  auth: {
    user: process.env.BREVO_USER,
    pass: process.env.BREVO_PASS,
  },
});

// Validate email format
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const sendEmailWelcomeEmployee = async (
  email: string,
  name: string,
  tenantName: string,
  tenantEmail: string,
) => {
  if (!isValidEmail(email) || !name) {
    throw new Error("Invalid email or name");
  }

  const { VERCEL_PROJECT_PRODUCTION_URL } = process.env;
  const emailUrl = `https://${VERCEL_PROJECT_PRODUCTION_URL}/auth/employee/register`;

  const emailText = `
	Hello ${name},

	Thank you for joining ${tenantName} as an employee.

		Please sign up for your account by clicking the link below:

		${emailUrl}

	This link will be valid for 60 minutes. If the link does not work, please copy and paste it directly into your browser.

			If you have any questions or need assistance, please contact us at ${tenantEmail}.


				Best regards,
		${tenantName} HR Team
	`;

  try {
    return await transporter.sendMail({
      from: "Webmaster <support@aboutvibes.co.za>",
      to: email,
      subject: "Welcome to ${tenantName} HR Portal",
      text: emailText,
    });
  } catch (error) {
    console.error("Email verification send failed:", error);
    throw error;
  }
};

export const sendEmailVerification = async (email: string, token: string) => {
  if (!isValidEmail(email) || !token) {
    throw new Error("Invalid email or token");
  }

  const { VERCEL_PROJECT_PRODUCTION_URL } = process.env;
  const emailUrl = `https://${VERCEL_PROJECT_PRODUCTION_URL}/verify-email?token=${token}`;

  const emailText = `
	Hello,

	Please verify your email for the ACT Admin Portal by clicking the link below:

			${emailUrl}

		This link will be valid for 60 minutes. If the link does not work, please copy and paste it directly into your browser.

				If you did not request this verification, please ignore this email.

					Best regards,
			ACT Admin Portal Team
		`;

  try {
    return await transporter.sendMail({
      from: "Webmaster <support@aboutvibes.co.za>",
      to: email,
      subject: "Verify your email on ACT Admin Portal",
      text: emailText,
    });
  } catch (error) {
    console.error("Email verification send failed:", error);
    throw error;
  }
};

export const sendPasswordReset = async (email: string, token: string) => {
  if (!isValidEmail(email) || !token) {
    throw new Error("Invalid email or token");
  }

  const resetUrl = `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}/auth/reset-password/new-password/${token}`;

  const resetText = `
	Hello,

	You have requested to reset your password for the ACT Admin Portal.
			Click the link below to reset your password:

				${resetUrl}

		This link will be valid for 60 minutes. If the link does not work, please copy and paste it directly into your browser.

				If you did not request a password reset, please ignore this email.

					Best regards,
			ACT Admin Portal Team
		`;

  try {
    return await transporter.sendMail({
      from: "Webmaster <support@aboutvibes.co.za>",
      to: email,
      subject: "Reset your password on ACT Admin Portal",
      text: resetText,
    });
  } catch (error) {
    console.error("Password reset email send failed:", error);
    throw error;
  }
};
