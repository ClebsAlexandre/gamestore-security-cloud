const purchaseRepository = require('../repositories/purchaseRepository');

class PurchaseController {
  async checkout(req, res, next) {
    try {
      const { gameTitle, email, cpf, phone, quantity, cardName, cardNumber, expiry, cvv } = req.body;
      
      // Validação básica de integridade no servidor
      if (!gameTitle || !email || !cpf || !phone || !quantity || !cardName || !cardNumber || !expiry || !cvv) {
        const err = new Error('Dados incompletos ou inválidos para a transação (Violação de Integridade).');
        err.status = 400;
        throw err;
      }

      const result = await purchaseRepository.create({ gameTitle, email, cpf, phone, quantity, cardName, cardNumber, expiry, cvv });
      
      console.log(`[Worker ${process.pid}] [COMPRA APROVADA] ${quantity}x '${gameTitle}' | Cliente: ${email} | Total: R$ ${result.totalPrice}`);

      res.status(201).json({
        success: true,
        message: 'Compra finalizada com sucesso e registrada com Integridade no banco de dados!',
        data: {
          purchaseId: result.id,
          totalPrice: result.totalPrice
        }
      });
    } catch (error) {
      // Qualquer erro cai aqui e é tratado pelo middleware seguro de Confidencialidade
      next(error); 
    }
  }
}

module.exports = new PurchaseController();
