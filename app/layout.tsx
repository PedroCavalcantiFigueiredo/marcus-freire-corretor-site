import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import "./globals.css"
import { SocialButtons } from "@/components/social-buttons"

export const metadata: Metadata = {
  title: "Marcus Freire - Corretor de Imóveis",
  description:
    "Corretor de imóveis especializado em Pouso Alegre - MG e região. Encontre o imóvel dos seus sonhos com atendimento personalizado e profissional.",
  generator: "v0.app",
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
  openGraph: {
    title: "Marcus Freire - Corretor de Imóveis",
    description:
      "Corretor de imóveis especializado em Pouso Alegre - MG e região. Encontre o imóvel dos seus sonhos com atendimento personalizado e profissional.",
    type: "website",
    locale: "pt_BR",
    siteName: "Marcus Freire Imóveis",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "Marcus Freire - Corretor de Imóveis",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Marcus Freire - Corretor de Imóveis",
    description:
      "Corretor de imóveis especializado em Pouso Alegre - MG e região. Encontre o imóvel dos seus sonhos com atendimento personalizado e profissional.",
    images: ["/logo.png"],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable} antialiased`}>
        <Suspense fallback={null}>{children}</Suspense>
        <SocialButtons />
        <Analytics />
      </body>
    </html>
  )
}