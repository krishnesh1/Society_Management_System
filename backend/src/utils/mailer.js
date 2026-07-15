import nodemailer from "nodemailer";

function smtpReady() {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_PORT && process.env.SMTP_USER && process.env.SMTP_PASS);
}

function createTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
}

export async function sendMail({ to, subject, text, html }) {
  if (!smtpReady()) {
    console.log(`[mail:dev] To: ${to}`);
    console.log(`[mail:dev] Subject: ${subject}`);
    console.log(`[mail:dev] ${text}`);
    return { dev: true };
  }

  try {
    const transporter = createTransporter();
    return await transporter.sendMail({
      from: process.env.MAIL_FROM || process.env.SMTP_USER,
      to,
      subject,
      text,
      html
    });
  } catch (error) {
    console.error("Email send failed", error.message);
    return { error: error.message };
  }
}

export function createOtp() {
  return String(Math.floor(100000 + Math.random() * 900000));
}
