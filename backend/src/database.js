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
    
    db.serialize(() => {
      db.run(`
        CREATE TABLE IF NOT EXISTS games (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          title TEXT NOT NULL UNIQUE,
          price REAL NOT NULL
        )
      `);

      // Popula os preços originais do sistema para garantir Integridade
      const stmt = db.prepare(`INSERT OR IGNORE INTO games (id, title, price) VALUES (?, ?, ?)`);
      stmt.run(1, 'Cyberpunk 2077', 199.90);
      stmt.run(2, 'Elden Ring', 249.90);
      stmt.run(3, 'God of War', 199.90);
      stmt.run(4, 'Red Dead Redemption 2', 299.90);
      stmt.run(5, 'The Witcher 3: Wild Hunt', 129.99);
      stmt.run(6, 'Grand Theft Auto V', 82.00);
      stmt.run(7, 'Resident Evil 4', 249.00);
      stmt.run(8, 'Hogwarts Legacy', 249.99);
      stmt.finalize();

      db.run(`
        CREATE TABLE IF NOT EXISTS purchases (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          game_title TEXT NOT NULL,
          email TEXT NOT NULL,
          cpf TEXT NOT NULL,
          phone TEXT NOT NULL,
          quantity INTEGER NOT NULL CHECK(quantity > 0 AND quantity <= 5),
          total_price REAL NOT NULL,
          card_name TEXT NOT NULL,
          card_number TEXT NOT NULL,
          expiry TEXT NOT NULL,
          cvv TEXT NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `, (err) => {
        if (err) {
          console.error('Erro ao criar tabela purchases:', err.message);
        } else {
          console.log('Tabelas verificadas (Integridade garantida por Constraints SQL).');
        }
      });
    });
  }
});

module.exports = db;
