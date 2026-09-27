const db = require('../database');
const bcrypt = require('bcrypt');

class PurchaseRepository {
  async create(purchaseData) {
    const { gameTitle, email, cpf, phone, quantity, cardName, cardNumber, expiry, cvv } = purchaseData;
    
    // Validação de Integridade: Busca o preço original no banco de dados
    const gameResult = await db.query(`SELECT price FROM games WHERE title = $1`, [gameTitle]);
    if (gameResult.rows.length === 0) {
      const notFoundErr = new Error('Jogo não encontrado no catálogo oficial.');
      notFoundErr.status = 404;
      throw notFoundErr;
    }
    
    const game = gameResult.rows[0];
    const totalPrice = game.price * quantity;

    // 1. Mascaramento de Dados (Slide 3)
    // Protege o número real, salvando apenas os 4 últimos dígitos
    const maskedCardNumber = '**** **** **** ' + cardNumber.slice(-4);

    // 2. Hashing de Senhas (Slide 3)
    // Aplica Hash com Salt no CVV do cartão (irrecuperável se houver vazamento)
    const hashedCvv = await bcrypt.hash(cvv, 10);

    const sql = `INSERT INTO purchases (game_title, email, cpf, phone, quantity, total_price, card_name, card_number, expiry, cvv) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING id`;
    
    const purchaseResult = await db.query(sql, [
      gameTitle, email, cpf, phone, quantity, totalPrice, cardName, maskedCardNumber, expiry, hashedCvv
    ]);
    
    const purchaseId = purchaseResult.rows[0].id;

    // 3. Auditoria e Logs (Slide 4)
    // Registra quem fez o quê no banco, para análise forense
    await db.query(`INSERT INTO audit_logs (action, details) VALUES ($1, $2)`, [
      'NOVA_COMPRA', 
      \`Usuário (Email: ${email}) registrou a compra do jogo ${gameTitle}\`
    ]);

    return { id: purchaseId, totalPrice, ...purchaseData };
  }
}

module.exports = new PurchaseRepository();
