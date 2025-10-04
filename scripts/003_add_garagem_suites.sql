-- Adiciona campos de garagem coberta e suítes à tabela de imóveis

ALTER TABLE imoveis
ADD COLUMN IF NOT EXISTS garagem_coberta BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS suites INTEGER DEFAULT 0;

-- Atualiza imóveis existentes com valores padrão
UPDATE imoveis
SET garagem_coberta = false,
    suites = 0
WHERE garagem_coberta IS NULL OR suites IS NULL;

COMMENT ON COLUMN imoveis.garagem_coberta IS 'Indica se o imóvel possui garagem coberta';
COMMENT ON COLUMN imoveis.suites IS 'Quantidade de suítes do imóvel';
