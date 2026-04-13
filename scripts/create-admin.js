const { neon } = require('@neondatabase/serverless');
const bcrypt = require('bcryptjs');

// Configuração manual do env (mesmo padrão do migrate-neon.js)
const sql = neon(process.env.DATABASE_URL);

async function createAdmin() {
  const email = 'admin@marcusfreire.com.br'; // Você pode mudar isso depois
  const password = 'admin123'; // Você DEVE mudar isso no primeiro login ou via env
  
  console.log(`Creating admin user: ${email}...`);

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    
    await sql`
      INSERT INTO users (email, password, name)
      VALUES (${email}, ${hashedPassword}, 'Administrador')
      ON CONFLICT (email) DO UPDATE 
      SET password = ${hashedPassword}, name = 'Administrador';
    `;
    
    console.log('Admin user created/updated successfully!');
    console.log('Email:', email);
    console.log('Password:', password);
  } catch (error) {
    console.error('Error creating admin user:', error);
  }
}

createAdmin();
