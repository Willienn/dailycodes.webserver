import { NextResponse } from "next/server";

export async function GET() {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000); // timeout 10s

  try {
    const res = await fetch("https://api.mcsrvstat.us/3/play.dailycodes.dev", {
      signal: controller.signal,
      headers: {
        "User-Agent":
          "DailyCodesStatusChecker/1.0 (+https://server.dailycodes.dev)",
      },
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      return NextResponse.json(
        { error: `Erro na API externa: ${res.status} ${res.statusText}` },
        { status: res.status }
      );
    }

    const data = await res.json();

    return NextResponse.json(data, {
      headers: {
        "Access-Control-Allow-Origin": "*", // opcional
      },
    });
  } catch (error: any) {
    clearTimeout(timeoutId);

    if (error.name === "AbortError") {
      return NextResponse.json(
        { error: "Tempo esgotado ao tentar acessar a API externa." },
        { status: 408 }
      );
    }

    return NextResponse.json(
      { error: "Erro inesperado ao buscar o status do servidor." },
      { status: 500 }
    );
  }
}
