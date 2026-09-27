const { Pool } = require('pg');

// Configuração do PostgreSQL (Isolamento de Rede - Banco na Nuvem Render)
const connectionString = process.env.DATABASE_URL || 'postgresql://gamestore_pro_user:8inAJNQrZa5KhCkpgjvsALgZ5zZjMSSl@dpg-dasps60jo6nc73csgb7g-a.oregon-postgres.render.com/gamestore_pro';

const pool = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false // Necessário para conexões externas na Render
  }
});

const initDB = async () => {
  try {
    const client = await pool.connect();
    console.log('✅ Conexão com o Banco PostgreSQL estabelecida com sucesso! (Isolamento de Rede)');

    // ==========================================
    // CHECKLIST: A Tríade CID no Banco de Dados
    // ==========================================

    // 1. Tabela de Jogos
    await client.query(`
      CREATE TABLE IF NOT EXISTS games (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL UNIQUE,
        price REAL NOT NULL
      );
    `);

    // Inserir jogos padrão para garantir Integridade de preços
    await client.query(`
      INSERT INTO games (id, title, price) VALUES 
      (1, 'Cyberpunk 2077', 199.90),
      (2, 'Elden Ring', 249.90),
      (3, 'God of War', 199.90),
      (4, 'Red Dead Redemption 2', 299.90),
      (5, 'The Witcher 3: Wild Hunt', 129.99),
      (6, 'Grand Theft Auto V', 82.00),
      (7, 'Resident Evil 4', 249.00),
      (8, 'Hogwarts Legacy', 249.99)
      ON CONFLICT (id) DO NOTHING;
    `);

    // 2. Tabela de Compras (Dados sensíveis)
    await client.query(`
      CREATE TABLE IF NOT EXISTS purchases (
        id SERIAL PRIMARY KEY,
        game_title VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        cpf VARCHAR(14) NOT NULL,
        phone VARCHAR(15) NOT NULL,
        quantity INTEGER NOT NULL CHECK(quantity > 0 AND quantity <= 5),
        total_price REAL NOT NULL,
        card_name VARCHAR(255) NOT NULL,
        card_number VARCHAR(19) NOT NULL,
        expiry VARCHAR(5) NOT NULL,
        cvv VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 3. Tabela de Auditoria (Slide 4 - Monitoramento e Auditoria)
    await client.query(`
      CREATE TABLE IF NOT EXISTS audit_logs (
        id SERIAL PRIMARY KEY,
        action VARCHAR(255) NOT NULL,
        details TEXT NOT NULL,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 4. Princípio do Menor Privilégio (Slide 3 - Controle de Acesso Granular)
    // Criamos uma role (cargo) que SÓ tem permissão de Inserir, e não de Deletar.
    await client.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'app_user_restricted') THEN
          CREATE ROLE app_user_restricted;
        END IF;
      END
      $$;
    `);
    
    await client.query(`GRANT INSERT ON purchases TO app_user_restricted;`);
    await client.query(`REVOKE DELETE, UPDATE ON purchases FROM app_user_restricted;`);

    console.log('🔒 Tabelas, Auditoria e Regras de Menor Privilégio configuradas no PostgreSQL!');
    client.release();
  } catch (err) {
    console.error('❌ Erro fatal ao conectar no PostgreSQL:', err.message);
  }
};

initDB();

module.exports = {
  query: (text, params) => pool.query(text, params),
};
