"use client"

import { MessageCircle, Instagram } from "lucide-react"
import Link from "next/link"

export function SocialButtons() {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
      {/* WhatsApp Button */}
      <Link
        href="https://wa.me/5535998807707"
        target="_blank"
        rel="noopener noreferrer"
        className="group flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-all hover:scale-110 hover:shadow-xl"
        aria-label="Falar no WhatsApp"
      >
        <MessageCircle className="h-7 w-7" />
      </Link>

      {/* Instagram Button */}
      <Link
        href="https://www.instagram.com/marcus.freire.imoveis/"
        target="_blank"
        rel="noopener noreferrer"
        className="group flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[#833AB4] via-[#E1306C] to-[#F77737] text-white shadow-lg transition-all hover:scale-110 hover:shadow-xl"
        aria-label="Seguir no Instagram"
      >
        <Instagram className="h-7 w-7" />
      </Link>
    </div>
  )
}
