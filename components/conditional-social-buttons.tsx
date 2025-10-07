"use client"

import { usePathname } from "next/navigation"
import { SocialButtons } from "@/components/social-buttons"

export function ConditionalSocialButtons() {
  const pathname = usePathname()

  // Se a rota atual começar com "/admin", não renderize nada (retorne null).
  if (pathname.startsWith("/admin")) {
    return null
  }

  // Para todas as outras rotas, renderize os botões sociais.
  return <SocialButtons />
}