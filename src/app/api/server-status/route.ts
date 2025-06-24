import { NextResponse } from "next/server";

export async function GET() {
  try {
    const res = await fetch("https://api.mcsrvstat.us/3/play.dailycodes.dev", {
      headers: {
        "User-Agent":
          "DailyCodesStatusChecker/1.0 (+https://server.dailycodes.dev)",
      },
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: `Erro na API externa: ${res.status} ${res.statusText}` },
        { status: res.status }
      );
    }

    const data = await res.json();

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { error: "Erro inesperado ao buscar o status do servidor." },
      { status: 500 }
    );
  }
}
