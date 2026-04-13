const { neon } = require('@neondatabase/serverless');
const bcrypt = require('bcryptjs');

// 1. COLOQUE OS DADOS DO NOVO USUÁRIO AQUI:
const NOVO_EMAIL = 'marcusmfreire@gmail.com';
const NOVA_SENHA = '011065';
const NOME = 'Marcus Freire';

async function criarUsuario() {
  if (!process.env.DATABASE_URL) {
    console.error('ERRO: DATABASE_URL não encontrada no ambiente.');
    return;
  }

  const sql = neon(process.env.DATABASE_URL);

  console.log(`Gerando acesso para: ${NOVO_EMAIL}...`);

  try {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(NOVA_SENHA, salt);

    await sql`
      INSERT INTO users (email, password, name)
      VALUES (${NOVO_EMAIL}, ${passwordHash}, ${NOME})
      ON CONFLICT (email) 
      DO UPDATE SET password = ${passwordHash}, name = ${NOME};
    `;

    console.log('--------------------------------------------------');
    console.log('SUCESSO! Usuário criado/atualizado no Neon.');
    console.log(`Login: ${NOVO_EMAIL}`);
    console.log(`Senha: ${NOVA_SENHA}`);
    console.log('--------------------------------------------------');
  } catch (error) {
    console.error('Erro ao criar usuário:', error);
  }
}

criarUsuario();
