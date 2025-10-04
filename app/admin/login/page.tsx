"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Home } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function AdminLoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [isRegistering, setIsRegistering] = useState(false)
  const router = useRouter()
  const supabase = getSupabaseBrowserClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        setError("Email ou senha incorretos")
        return
      }

      router.push("/admin/dashboard")
      router.refresh()
    } catch (err) {
      setError("Erro ao fazer login. Tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/admin/dashboard`,
        },
      })

      if (error) {
        setError(error.message)
        return
      }

      setError("")
      alert("Conta criada com sucesso! Verifique seu email para confirmar o cadastro.")
      setIsRegistering(false)
    } catch (err) {
      setError("Erro ao criar conta. Tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-4">
          <Link href="/" className="inline-block">
            <Image src="/logo.png" alt="Marcus Freire Logo" width={200} height={80} className="mx-auto" />
          </Link>
          <h1 className="text-2xl font-bold">Área Administrativa</h1>
          <p className="text-muted-foreground">
            {isRegistering ? "Crie sua conta de administrador" : "Entre com suas credenciais"}
          </p>
        </div>

        <Card className="p-6">
          <form onSubmit={isRegistering ? handleRegister : handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                minLength={6}
              />
              {isRegistering && <p className="text-xs text-muted-foreground">Mínimo de 6 caracteres</p>}
            </div>

            {error && <div className="text-sm text-red-500 bg-red-50 dark:bg-red-950/20 p-3 rounded-md">{error}</div>}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading
                ? isRegistering
                  ? "Criando conta..."
                  : "Entrando..."
                : isRegistering
                  ? "Criar Conta"
                  : "Entrar"}
            </Button>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => {
                  setIsRegistering(!isRegistering)
                  setError("")
                }}
                className="text-sm text-primary hover:underline"
                disabled={loading}
              >
                {isRegistering ? "Já tem uma conta? Fazer login" : "Primeira vez? Criar conta"}
              </button>
            </div>
          </form>
        </Card>

        <div className="text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <Home className="w-4 h-4" />
            Voltar para o site
          </Link>
        </div>
      </div>
    </div>
  )
}
