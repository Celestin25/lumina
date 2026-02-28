import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const domain = process.env.NEXTAUTH_URL || "http://localhost:3000";

export const sendVerificationEmail = async (
  email: string, 
  token: string
) => {
  const confirmLink = `${domain}/auth/verify?token=${token}`;

  await resend.emails.send({
    from: "Lumina <onboarding@resend.dev>",
    to: email,
    subject: "Confirm your email - Lumina",
    html: `
      <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px;">
        <h1 style="color: #d4af37;">Lumina✦</h1>
        <h2>Confirm your email address</h2>
        <p>Thank you for joining Lumina. Please confirm your email address by clicking the button below:</p>
        <div style="margin: 30px 0;">
          <a href="${confirmLink}" style="background-color: #d4af37; color: #111; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">
            Confirm Email
          </a>
        </div>
        <p style="font-size: 12px; color: #666;">If you did not request this, please ignore this email.</p>
        <p style="font-size: 12px; color: #666;">Or copy and paste this link in your browser:<br/>${confirmLink}</p>
      </div>
    `
  });
};
