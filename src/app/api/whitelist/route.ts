import { NextResponse } from "next/server";
import {
  addWhitelistRequest,
  confirmWhitelistRequest,
} from "@/lib/lowDB/database";
import nodemailer from "nodemailer";
import { randomBytes } from "crypto";
import { URL } from "url";

async function sendEmail(to: string, username: string, token: string) {
  const transporter = nodemailer.createTransport({
    host: "smtp.example.com", // TODO Change to your SMTP server
    port: 587, // SMTP server port
    secure: false, // TODO check this (true if using port 465)
    auth: {
      user: "your-email@example.com", // TODO add email
      pass: "your-email-password", // TODO add password
    },
  });

  const confirmationUrl = new URL(
    "/confirm-email",
    process.env.NEXT_PUBLIC_BASE_API_URL,
  );
  confirmationUrl.searchParams.append("token", token);

  const mailOptions = {
    from: '"Dailycodes SMP" <social@dailycodes.dev>',
    to, // Recipient
    subject: "Confirme seu Email para Whitelist",
    text: `Olá ${username},\n\nPor favor, confirme seu email para concluir a solicitação de whitelist clicando no link abaixo:\n${confirmationUrl}\n\nAtenciosamente,\nDailycodes SMP`,
    html: `
      <p>Olá <strong>${username}</strong>,</p>
      <p>Por favor, confirme seu email para concluir a solicitação de whitelist clicando no link abaixo:</p>
      <p><a href="${confirmationUrl}">Confirmar Email</a></p>
      <p>Atenciosamente,<br>Dailycodes SMP</p>`,
  };

  // await transporter.sendMail(mailOptions);
}

export async function POST(req: Request) {
  const { username, email, message } = await req.json();
  const date = new Date().toISOString();

  const token = randomBytes(32).toString("hex");

  await addWhitelistRequest({
    username,
    email,
    message,
    date,
    token,
    confirmed: false,
  });

  // await sendEmail(email, username, token);

  return NextResponse.json(
    {
      message:
        "Solicitação de whitelist adicionada com sucesso e e-mail de confirmação enviado!",
    },
    { status: 201 },
  );
}

export async function OPTIONS() {
  return NextResponse.json(
    { message: "Method not allowed" },
    { status: 405, headers: { Allow: "POST" } },
  );
}
