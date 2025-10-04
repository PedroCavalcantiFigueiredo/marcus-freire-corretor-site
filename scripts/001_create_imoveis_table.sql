-- Criar tabela de imóveis
CREATE TABLE IF NOT EXISTS imoveis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo TEXT NOT NULL,
  tipo TEXT NOT NULL,
  preco TEXT NOT NULL,
  localizacao TEXT NOT NULL,
  quartos INTEGER NOT NULL,
  banheiros INTEGER NOT NULL,
  area INTEGER NOT NULL,
  imagem TEXT,
  destaque BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Inserir dados de exemplo
INSERT INTO imoveis (titulo, tipo, preco, localizacao, quartos, banheiros, area, imagem, destaque) VALUES
('Apartamento Moderno no Jardins', 'Apartamento', 'R$ 850.000', 'Jardins, São Paulo', 3, 2, 120, '/modern-apartment-living-room.png', true),
('Casa com Piscina em Condomínio', 'Casa', 'R$ 1.200.000', 'Alphaville, Barueri', 4, 3, 250, '/luxury-house-with-pool.png', true),
('Cobertura Duplex Vista Mar', 'Cobertura', 'R$ 2.500.000', 'Riviera de São Lourenço', 5, 4, 350, '/penthouse-ocean-view.jpg', false),
('Studio Compacto Centro', 'Studio', 'R$ 320.000', 'Centro, São Paulo', 1, 1, 35, '/compact-studio-apartment.png', false),
('Sobrado em Condomínio Fechado', 'Sobrado', 'R$ 980.000', 'Granja Viana, Cotia', 4, 3, 280, '/townhouse-gated-community.jpg', false),
('Loft Industrial Vila Madalena', 'Loft', 'R$ 650.000', 'Vila Madalena, São Paulo', 2, 1, 90, '/industrial-loft-interior.jpg', false);
