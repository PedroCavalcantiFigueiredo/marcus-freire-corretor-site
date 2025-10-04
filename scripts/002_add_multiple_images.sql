-- Adicionar coluna para múltiplas imagens
ALTER TABLE imoveis ADD COLUMN IF NOT EXISTS imagens JSONB DEFAULT '[]'::jsonb;

-- Migrar imagens existentes do campo 'imagem' para 'imagens' (array)
UPDATE imoveis 
SET imagens = jsonb_build_array(imagem)
WHERE imagem IS NOT NULL AND imagem != '' AND (imagens IS NULL OR imagens = '[]'::jsonb);

-- Comentário: A coluna 'imagem' antiga é mantida para compatibilidade
-- mas o sistema agora usará a coluna 'imagens' (array) como principal
