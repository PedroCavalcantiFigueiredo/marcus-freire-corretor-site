import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Phone, Mail, MapPin, Award, Users, TrendingUp, Building2 } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Navigation />

      <main>
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-16 md:py-24">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="space-y-2">
                <p className="font-medium text-primary">Corretor de Imóveis</p>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-balance">Marcus Freire</h1>
              </div>

              <p className="text-lg text-muted-foreground leading-relaxed text-pretty">
                Olá! Eu sou Marcus Freire, corretor de imóveis atuando em Pouso Alegre - MG e região. Minha missão é ajudar
                você a encontrar o imóvel dos seus sonhos ou realizar a melhor venda do seu patrimônio.
              </p>

              <p className="text-muted-foreground leading-relaxed">
                Com dedicação, transparência e profissionalismo, acompanho cada etapa do processo, desde a primeira
                visita até a assinatura do contrato. Acredito que cada cliente merece atenção personalizada e um
                atendimento que supere expectativas.
              </p>

              <div className="flex flex-wrap gap-3 pt-4">
                <Button asChild size="lg" className="gap-2">
                  <Link href="/imoveis">
                    <Building2 className="w-4 h-4" />
                    Ver Imóveis
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="gap-2 bg-transparent">
                  <Link href="/contato">
                    <Mail className="w-4 h-4" />
                    Entre em Contato
                  </Link>
                </Button>
              </div>
            </div>

            <div className="relative">
              <div className="aspect-[3/4] relative rounded-lg overflow-hidden bg-muted">
                <img
                  src="/marcus-freire.png"
                  alt="Marcus Freire - Corretor de Imóveis"
                  className="object-cover w-full h-full"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="bg-muted/50 py-16">
          <div className="container mx-auto px-4">
            <div className="grid sm:grid-cols-3 gap-8">
              <Card className="p-6 text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mx-auto">
                  <Award className="w-6 h-6 text-primary" />
                </div>
                <div className="text-3xl font-bold text-foreground">3+</div>
                <div className="text-sm text-muted-foreground">Anos de Experiência</div>
              </Card>

              <Card className="p-6 text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mx-auto">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <div className="text-3xl font-bold text-foreground">100+</div>
                <div className="text-sm text-muted-foreground">Clientes Satisfeitos</div>
              </Card>

              <Card className="p-6 text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mx-auto">
                  <TrendingUp className="w-6 h-6 text-primary" />
                </div>
                <div className="text-3xl font-bold text-foreground">100+</div>
                <div className="text-sm text-muted-foreground">Negócios Fechados</div>
              </Card>
            </div>
          </div>
        </section>

        {/* Contact Info Section */}
        <section className="container mx-auto px-4 py-16">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">Entre em Contato</h2>

            <div className="grid sm:grid-cols-3 gap-6">
              <Card className="p-6 space-y-3">
                <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                  <Phone className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <div className="font-medium mb-1">Telefone</div>
                  <a
                    href="tel:+5535998807707"
                    className="text-sm text-muted-foreground hover:text-accent transition-colors"
                  >
                    (35) 99880-7707
                  </a>
                </div>
              </Card>

              <Card className="p-6 space-y-3">
                <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                  <Mail className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <div className="font-medium mb-1">E-mail</div>
                  <a
                    href="mailto:marcusmfreire@gmail.com"
                    className="text-sm text-muted-foreground hover:text-accent transition-colors break-all"
                  >
                    marcusmfreire@gmail.com
                  </a>
                </div>
              </Card>

              <Card className="p-6 space-y-3">
                <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <div className="font-medium mb-1">Localização</div>
                  <p className="text-sm text-muted-foreground">Pouso Alegre - MG</p>
                </div>
              </Card>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
