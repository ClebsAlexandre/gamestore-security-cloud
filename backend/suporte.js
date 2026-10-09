const { Pool } = require('pg');

require('dotenv').config();
const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error("ERRO: Configure a DATABASE_URL no arquivo .env");
  process.exit(1);
}

const pool = new Pool({
  connectionString,
  ssl: { rejectUnauthorized: false }
});

async function runSuportePanel() {
  console.log('================================================');
  console.log('🎧 PAINEL DA EQUIPE DE SUPORTE (ACESSO RESTRITO)');
  console.log('================================================\n');

  try {
    const client = await pool.connect();

    // Troca o usuário do banco de dados para o perfil do suporte!
    // Assim, nós perdemos os poderes de administrador e ficamos apenas com as permissões deles.
    await client.query("SET ROLE equipe_suporte");
    console.log('[SISTEMA]: Login efetuado como "equipe_suporte".\n');

    console.log('1. Tentando acessar a tabela original de compras (com cartões e CVV)...');
    try {
      await client.query('SELECT * FROM purchases LIMIT 1');
      console.log('Isso não deve aparecer.');
    } catch (err) {
      console.log(`❌ ACESSO NEGADO: O banco de dados bloqueou! Motivo: ${err.message}`);
    }
    console.log('');

    console.log('2. Tentando acessar a View autorizada do suporte (Sem cartões)...');
    try {
      const view = await client.query('SELECT * FROM vw_suporte_compras ORDER BY id DESC LIMIT 5');
      if (view.rows.length === 0) {
        console.log('Nenhuma compra na View ainda.');
      } else {
        console.table(view.rows);
        console.log('✅ ACESSO PERMITIDO: A equipe consegue ver as compras, mas sem dados sensíveis!');
      }
    } catch (err) {
      console.log(`Erro ao acessar a View: ${err.message}`);
    }

    client.release();
  } catch (error) {
    console.error('Erro na conexão:', error.message);
  } finally {
    pool.end();
  }
}

runSuportePanel();
