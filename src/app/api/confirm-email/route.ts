import { NextResponse } from "next/server";
import { confirmWhitelistRequest } from "@/lib/lowDB/database";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");

  if (!token) {
    return NextResponse.json({ error: "Token inválido" }, { status: 400 });
  }

  // Confirm the request in the database using the token
  const isConfirmed = await confirmWhitelistRequest(token);

  if (!isConfirmed) {
    return NextResponse.json(
      { error: "Token inválido ou expirado" },
      { status: 400 },
    );
  }

  return NextResponse.json(
    { message: "Email confirmado com sucesso!" },
    { status: 200 },
  );
}
