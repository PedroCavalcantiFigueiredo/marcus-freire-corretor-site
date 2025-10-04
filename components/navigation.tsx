"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Building2, Mail } from "lucide-react"
import Image from "next/image"

export function Navigation() {
  const pathname = usePathname()

  const links = [
    { href: "/", label: "Home", icon: Home },
    { href: "/imoveis", label: "Imóveis", icon: Building2 },
    { href: "/contato", label: "Contato", icon: Mail },
  ]

  return (
    <nav className="border-b border-border bg-card py-[23px]">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center">
            <Image
              src="/logo.png"
              alt="Marcus Freire - Corretor de Imóveis"
              width={120}
              height={40}
              className="w-auto h-24"
              priority
            />
          </Link>

          <div className="flex gap-1">
            {links.map((link) => {
              const Icon = link.icon
              const isActive = pathname === link.href

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{link.label}</span>
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </nav>
  )
}
