const db = require('../database');

class PurchaseRepository {
  create(purchaseData) {
    return new Promise((resolve, reject) => {
      const { gameTitle, email, cpf, phone, quantity, cardName, cardNumber, expiry, cvv } = purchaseData;
      
      // Validação de Integridade: Busca o preço original no banco de dados
      db.get(`SELECT price FROM games WHERE title = ?`, [gameTitle], (err, game) => {
        if (err) return reject(err);
        if (!game) {
          const notFoundErr = new Error('Jogo não encontrado no catálogo oficial.');
          notFoundErr.status = 404;
          return reject(notFoundErr);
        }

        // O backend calcula o preço total (nunca confia no frontend)
        const totalPrice = game.price * quantity;

        const sql = `INSERT INTO purchases (game_title, email, cpf, phone, quantity, total_price, card_name, card_number, expiry, cvv) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        
        db.run(sql, [gameTitle, email, cpf, phone, quantity, totalPrice, cardName, cardNumber, expiry, cvv], function(err) {
          if (err) {
            return reject(err);
          }
          resolve({ id: this.lastID, totalPrice, ...purchaseData });
        });
      });
    });
  }
}

module.exports = new PurchaseRepository();
