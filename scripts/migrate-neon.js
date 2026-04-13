const { neon } = require('@neondatabase/serverless');
const fs = require('fs');
const path = require('path');

const sql = neon(process.env.DATABASE_URL);

async function migrate() {
  console.log('Starting migration...');

  try {
    // 1. Create Users Table
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        name TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `;
    console.log('Users table created.');

    // 2. Create Imoveis Table
    await sql`
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
        imagens TEXT[],
        destaque BOOLEAN DEFAULT false,
        garagem_coberta BOOLEAN DEFAULT false,
        suites INTEGER DEFAULT 0,
        informacoes_adicionais TEXT,
        contato_proprietario TEXT,
        preco_numerico DECIMAL(12,2),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `;
    console.log('Imoveis table created.');

    // 3. Create Contatos Table
    await sql`
      CREATE TABLE IF NOT EXISTS contatos (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        nome TEXT NOT NULL,
        email TEXT NOT NULL,
        telefone TEXT NOT NULL,
        mensagem TEXT NOT NULL,
        lida BOOLEAN DEFAULT false,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `;
    console.log('Contatos table created.');

    console.log('Migration finished successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
  }
}

migrate();
