const cluster = require('cluster');
const os = require('os');

// ==========================================
// CHECKLIST: A Tríade CID no Back-End
// 3. DISPONIBILIDADE (Cluster Nativo para Balanceamento de Carga)
// ==========================================
// Usando o módulo nativo de cluster para rodar múltiplas instâncias
// garantindo alta disponibilidade (se um cair, os outros continuam).
if (cluster.isPrimary) {
  const numCPUs = os.cpus().length;
  console.log(`[Master] Processo primário ${process.pid} inicializando...`);
  console.log(`[Master] Configurando cluster para balanceamento de carga (${numCPUs} workers) para garantir DISPONIBILIDADE...`);

  // Cria um worker para cada núcleo de CPU
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  // Se um worker morrer (crash), substituímos na mesma hora
  cluster.on('exit', (worker, code, signal) => {
    console.warn(`[Master] Worker ${worker.process.pid} caiu. Reiniciando um novo para manter o servidor de pé...`);
    cluster.fork();
  });
} else {
  // Código do servidor roda isolado em cada worker
  require('dotenv').config();
  const express = require('express');
  const cors = require('cors');
  const purchaseController = require('./controllers/purchaseController');

  const app = express();
  app.use(cors());
  app.use(express.json());

  // Rota de Teste para forçar um erro e demonstrar a Confidencialidade
  app.get('/api/teste-erro', (req, res, next) => {
    const erroGrave = new Error(`Falha no banco de dados. API_KEY=${process.env.API_KEY} vazou!`);
    next(erroGrave); 
  });

  // Rota para testar a Disponibilidade (Derruba o processo)
  app.get('/api/kill', (req, res) => {
    console.log(`[Worker ${process.pid}] Recebeu comando de kill. Simulando queda fatal...`);
    process.exit(1);
  });

  // Rota para retornar o ID do Processo atual (Provar a ressurreição)
  app.get('/api/pid', (req, res) => {
    res.json({ pid: process.pid });
  });

  // Rota de Checkout Segura (Implementa Integridade via SQLite)
  app.post('/api/checkout', (req, res, next) => purchaseController.checkout(req, res, next));

  // ==========================================
  // CHECKLIST: A Tríade CID no Back-End
  // 1. CONFIDENCIALIDADE (Tratamento Seguro de Erros)
  // ==========================================
  // Middleware global de tratamento de erros (Garante a Confidencialidade)
  app.use((err, req, res, next) => {
    // 1. O erro real (que contém caminhos de pasta e possíveis senhas)
    // é logado de forma "invisível" apenas no terminal do servidor (onde o usuário não tem acesso)
    console.error(`[Worker ${process.pid}] [LOG SECRETO]`, err.stack); 

    // 2. O usuário web (e o frontend) recebe APENAS uma mensagem mascarada e genérica.
    // Isso impede que um hacker use o stack trace para descobrir como o sistema funciona por dentro.
    return res.status(500).json({
      erro: 'Ocorreu um erro interno no servidor. Tente novamente mais tarde.'
    });
  });

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`[Worker ${process.pid}] GameStore rodando na porta ${PORT}`);
  });
}
