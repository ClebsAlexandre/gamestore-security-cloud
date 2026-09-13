const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Cria o arquivo do banco de dados na raiz da pasta backend
const dbPath = path.resolve(__dirname, '../gamestore.db');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Erro ao conectar com o banco de dados SQLite:', err.message);
  } else {
    console.log('Conexão com o banco de dados SQLite estabelecida com sucesso.');
    
    // ==========================================
    // CHECKLIST: A Tríade CID no Back-End
    // 2. INTEGRIDADE (Validação e Constraints em Banco de Dados)
    // ==========================================
    // O uso do banco SQL relacional (SQLite) nos ajuda a manter a Integridade dos dados.
    // Constraints como NOT NULL e CHECK garantem que dados inválidos não sejam gravados.
    
    db.run(`
      CREATE TABLE IF NOT EXISTS purchases (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        game_title TEXT NOT NULL,
        email TEXT NOT NULL,
        cpf TEXT NOT NULL,
        phone TEXT NOT NULL,
        quantity INTEGER NOT NULL CHECK(quantity > 0 AND quantity <= 5),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `, (err) => {
      if (err) {
        console.error('Erro ao criar tabela purchases:', err.message);
      } else {
        console.log('Tabela de compras verificada (Integridade garantida por Constraints SQL).');
      }
    });
  }
});

module.exports = db;
