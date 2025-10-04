-- Criar tabela de contatos
CREATE TABLE IF NOT EXISTS contatos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  email TEXT NOT NULL,
  telefone TEXT NOT NULL,
  mensagem TEXT NOT NULL,
  lida BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar índice para ordenação por data
CREATE INDEX IF NOT EXISTS idx_contatos_created_at ON contatos(created_at DESC);

-- Criar índice para filtrar mensagens não lidas
CREATE INDEX IF NOT EXISTS idx_contatos_lida ON contatos(lida);

-- Habilitar RLS (Row Level Security)
ALTER TABLE contatos ENABLE ROW LEVEL SECURITY;

-- Política para permitir inserção pública (formulário de contato)
CREATE POLICY "Permitir inserção pública de contatos"
  ON contatos
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Política para permitir leitura apenas para usuários autenticados
CREATE POLICY "Permitir leitura de contatos para usuários autenticados"
  ON contatos
  FOR SELECT
  TO authenticated
  USING (true);

-- Política para permitir atualização apenas para usuários autenticados
CREATE POLICY "Permitir atualização de contatos para usuários autenticados"
  ON contatos
  FOR UPDATE
  TO authenticated
  USING (true);

-- Política para permitir exclusão apenas para usuários autenticados
CREATE POLICY "Permitir exclusão de contatos para usuários autenticados"
  ON contatos
  FOR DELETE
  TO authenticated
  USING (true);
