require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Rota de Teste para forçar um erro e demonstrar a Confidencialidade
app.get('/api/teste-erro', (req, res, next) => {
  // Simulando um erro interno grave que contém a chave da API e stack trace vazando
  const erroGrave = new Error(`Falha no banco de dados. API_KEY=${process.env.API_KEY} vazou!`);
  next(erroGrave); 
});

// ==========================================
// CHECKLIST: A Tríade CID no Back-End
// 1. CONFIDENCIALIDADE (Tratamento Seguro de Erros)
// ==========================================
app.use((err, req, res, next) => {
  console.error("[LOG INTERNO SECRETO]", err.stack); // Salva no log interno, nunca envia pro cliente

  // Se estiver em Produção, o cliente recebe uma mensagem genérica limpa
  if (process.env.NODE_ENV === 'production') {
    return res.status(500).json({
      erro: 'Ocorreu um erro interno no servidor. Tente novamente mais tarde.',
      // Jamais retornar err.message ou err.stack aqui!
    });
  }

  // Se estiver em Desenvolvimento (seu notebook testando), mostra o erro pra facilitar
  return res.status(500).json({
    erro: err.message,
    stack: err.stack
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`GameStore Backend rodando na porta ${PORT}`);
});
