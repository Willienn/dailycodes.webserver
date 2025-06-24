import type { Metadata } from "next";
import "./globals.css";
import React, { ReactNode } from "react";

export const metadata: Metadata = {
  authors: {
    name: "Willien Muniz",
    url: "https://dailycodes.dev/",
  },
  alternates: {
    canonical: "https://server.dailycodes.dev",
  },
  title: "Dailycodes SMP",
  description:
    "Junte-se ao Dailycodes SMP, um servidor de Minecraft Vanilla++, criado para a mim e meus amigos. Explore, construa e faça amigos enquanto explora o modpack.",
  keywords: [
    "Dailycodes SMP",
    "servidor de Minecraft",
    "comunidade de Minecraft",
    "jogos multiplayer",
    "construção e exploração",
    "minecraft",
    "minecraft SMP",
    "servidor Minecraft",
    "servidor mods Minecraft",
    "Minecraft server",
    "melhores servidor Minecraft",
    "best minecraft servers",
  ],
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "https://server.dailycodes.dev/",
    siteName: "Dailycodes SMP",
    title: "Dailycodes SMP",
    description:
      "Junte-se ao Dailycodes SMP, um servidor de Minecraft Vanilla++, criado para a mim e meus amigos. Explore, construa e faça amigos enquanto explora o modpack.",
    images: [
      {
        url: "https://server.dailycodes.dev/images/OG.webp",
        width: 1098,
        height: 616,
        alt: "Dailycodes SMP",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html>
      <body className=" antialiased">{children}</body>
    </html>
  );
}
