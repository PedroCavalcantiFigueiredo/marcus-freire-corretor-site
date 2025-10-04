-- Adiciona coluna para informações adicionais dos imóveis
ALTER TABLE imoveis
ADD COLUMN IF NOT EXISTS informacoes_adicionais TEXT;

-- Adiciona comentário na coluna
COMMENT ON COLUMN imoveis.informacoes_adicionais IS 'Campo de texto livre para informações extras sobre o imóvel';
