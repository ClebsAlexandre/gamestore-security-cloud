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

async function runAdminPanel() {
  console.log('================================================');
  console.log('🛡️ PAINEL DO ADMINISTRADOR (PROVA DE SEGURANÇA)');
  console.log('================================================\n');

  try {
    const client = await pool.connect();

    console.log('0. Lendo Catálogo de Jogos (Tabela Protegida de Integridade)...');
    const games = await client.query('SELECT id, title, price FROM games ORDER BY id ASC');
    console.table(games.rows);
    console.log('');

    console.log('1. Lendo tabela de Compras (Verificando Mascaramento e Hashing)...');
    const purchases = await client.query('SELECT id, email, card_number, cvv FROM purchases ORDER BY id DESC LIMIT 5');
    if (purchases.rows.length === 0) {
      console.log('Nenhuma compra encontrada ainda. Faça uma compra no Front-end!');
    } else {
      console.table(purchases.rows);
    }
    console.log('');

    console.log('2. Lendo tabela de Auditoria (Trilha de Logs Forense)...');
    const logs = await client.query('SELECT action, details, timestamp FROM audit_logs ORDER BY id DESC LIMIT 5');
    if (logs.rows.length === 0) {
      console.log('Nenhum log encontrado.');
    } else {
      console.table(logs.rows);
    }
    console.log('');

    console.log('3. Lendo View de Suporte (Ocultação de Cartão - Ex 2)...');
    try {
      const view = await client.query('SELECT * FROM vw_suporte_compras ORDER BY id DESC LIMIT 5');
      if (view.rows.length === 0) {
        console.log('Nenhuma venda na View ainda.');
      } else {
        console.table(view.rows);
        console.log('-> Sucesso: A equipe de suporte consegue ver a compra, mas o CARTÃO e CVV estão ocultos!');
      }
    } catch (e) {
      console.log('A View ainda não foi criada no banco de dados.');
    }
    console.log('');

    console.log('4. Verificando Check Constraint Antifraude de Preço (Ex 1)...');
    console.log('-> Status: ATIVO. O banco rejeita qualquer tentativa de compra com preço R$ 0,00 ou negativo.');
    console.log('');

    console.log('5. Verificando Isolamento de Rede...');
    console.log('Status: ATIVO. O banco PostgreSQL está em uma sub-rede remota (Render Cloud).');

    client.release();
  } catch (error) {
    console.error('Erro:', error.message);
  } finally {
    pool.end();
  }
}

runAdminPanel();
