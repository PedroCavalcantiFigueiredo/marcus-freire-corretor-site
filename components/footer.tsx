import { Mail, MapPin, Phone } from "lucide-react"

export const Footer = () => {
  return (
    <footer className="bg-muted/50 border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Coluna 1: Sobre */}
          <div className="col-span-1 md:col-span-2 lg:col-span-1">
            <h3 className="text-lg font-bold text-foreground mb-3">Marcus Freire</h3>
            <p className="text-sm text-muted-foreground">
              Corretor de Imóveis especialista em Pouso Alegre - MG. Comprometido em oferecer o melhor atendimento, com
              transparência e profissionalismo.
            </p>
          </div>

          {/* Coluna 2: Navegação (opcional, pode adicionar links depois) */}
          <div>
            <h3 className="text-lg font-bold text-foreground mb-3">Navegação</h3>
            <ul className="space-y-2">
              <li>
                <a href="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Início
                </a>
              </li>
              <li>
                <a href="/imoveis" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Imóveis
                </a>
              </li>
              <li>
                <a href="/contato" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Contato
                </a>
              </li>
            </ul>
          </div>

          {/* Coluna 3: Contato */}
          <div>
            <h3 className="text-lg font-bold text-foreground mb-3">Contato</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <Phone className="w-4 h-4 mt-1 text-primary flex-shrink-0" />
                <a
                  href="tel:+5535998807707"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  (35) 99880-7707
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="w-4 h-4 mt-1 text-primary flex-shrink-0" />
                <a
                  href="mailto:marcusmfreire@gmail.com"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors break-all"
                >
                  marcusmfreire@gmail.com
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 mt-1 text-primary flex-shrink-0" />
                <p className="text-sm text-muted-foreground">Pouso Alegre - MG</p>
              </li>
            </ul>
          </div>
        </div>

        {/* Linha de Copyright */}
        <div className="border-t pt-6 flex flex-col sm:flex-row justify-between items-center text-center">
          <p className="text-xs text-muted-foreground mb-2 sm:mb-0">
            &copy; {new Date().getFullYear()} Marcus Freire Imóveis. Todos os direitos reservados.
          </p>
          <p className="text-xs text-muted-foreground">
            Desenvolvido por Pedro Cavalcanti Figueiredo
          </p>
        </div>
      </div>
    </footer>
  )
}