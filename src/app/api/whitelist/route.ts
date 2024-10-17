import { NextResponse } from "next/server";
import { addWhitelistRequest } from "@/lib/database";
import nodemailer from "nodemailer";

async function sendEmail(to: string, username: string) {
  const transporter = nodemailer.createTransport({
    host: "smtp.example.com", //TODO Change to your SMTP server
    port: 587, // SMTP server port
    secure: false, // TODO check this (true if using port 465)
    auth: {
      user: "your-email@example.com", //TODO add email
      pass: "your-email-password", //  TODO
    },
  });

  const mailOptions = {
    from: '"Dailycodes SMP" <social@dailycodes.dev>',
    to, //TODO Recipient
    subject: "Solicitação de Whitelist Recebida",
    text: `Olá ${username},\n\nSua solicitação de whitelist foi recebida com sucesso! Aguarde a confirmação.\n\nAtenciosamente,\nDailycodes SMP`,
    html: `<p>Olá <strong>${username}</strong>,</p><p>Sua solicitação de whitelist foi recebida com sucesso! Aguarde a confirmação.</p><p>Atenciosamente,<br>Dailycodes SMP</p>`,
  };

  await transporter.sendMail(mailOptions);
}

export async function POST(req: Request) {
  const { username, email, message } = await req.json();
  const date = new Date().toISOString();

  await addWhitelistRequest({ username, email, message, date });
  // TODO
  // await sendEmail(email, username); TODO

  return NextResponse.json(
    {
      message:
        "Solicitação de whitelist adicionada com sucesso e e-mail enviado!",
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
