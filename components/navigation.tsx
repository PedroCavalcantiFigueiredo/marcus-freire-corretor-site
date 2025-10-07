"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Building2, Mail } from "lucide-react"
import Image from "next/image"

export function Navigation() {
  const pathname = usePathname()

  const links = [
    { href: "/", label: "Início", icon: Home }, // Mudei "Home" para "Início"
    { href: "/imoveis", label: "Imóveis", icon: Building2 },
    { href: "/contato", label: "Contato", icon: Mail },
  ]

  return (
    <nav className="border-b border-border bg-card">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-24"> {/* Aumentei a altura do header */}
          <Link href="/" className="flex items-center">
            <Image
              src="/logo.png"
              alt="Marcus Freire - Corretor de Imóveis"
              width={120}
              height={40}
              className="w-auto h-25" // Ajustei a altura do logo
              priority
            />
          </Link>

          {/* Alterações principais estão aqui 👇 */}
          <div className="flex gap-1">
            {links.map((link) => {
              const Icon = link.icon
              const isActive = pathname === link.href

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  // AQUI ESTÁ A LÓGICA RESPONSIVA
                  className={`flex flex-col items-center justify-center sm:flex-row sm:gap-2 p-2 sm:px-4 h-16 w-20 sm:w-auto rounded-md transition-colors text-center ${
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  <Icon className="w-5 h-5 mb-1 sm:mb-0" />
                  {/* Removemos o "hidden" para o texto aparecer sempre */}
                  <span className="text-xs sm:text-sm">{link.label}</span>
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </nav>
  )
}