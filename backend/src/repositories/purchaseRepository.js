const db = require('../database');

class PurchaseRepository {
  create(purchaseData) {
    return new Promise((resolve, reject) => {
      // Uso de Prepared Statements (?) para evitar SQL Injection. 
      // Isso é fundamental para manter a INTEGRIDADE do banco de dados.
      const sql = `INSERT INTO purchases (game_title, email, cpf, phone, quantity) VALUES (?, ?, ?, ?, ?)`;
      
      const { gameTitle, email, cpf, phone, quantity } = purchaseData;
      
      db.run(sql, [gameTitle, email, cpf, phone, quantity], function(err) {
        if (err) {
          return reject(err);
        }
        resolve({ id: this.lastID, ...purchaseData });
      });
    });
  }
}

module.exports = new PurchaseRepository();
