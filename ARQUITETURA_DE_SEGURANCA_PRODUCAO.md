# Arquitetura de Segurança Estrutural no Banco de Dados

Conforme as diretrizes de segurança da informação da Tríade CID aplicadas ao armazenamento corporativo, a presente arquitetura utiliza **PostgreSQL** para garantir máxima resiliência e confidencialidade.

## 1. Criptografia em Repouso (Data at Rest)
O banco de dados PostgreSQL foi provisionado em instâncias gerenciadas pela nuvem, cujos volumes de disco físico (Storage) operam com Criptografia em Nível de Bloco (Block-Level Encryption usando padrão AES-256). Caso os discos rígidos do servidor sejam comprometidos, os dados permanecem ilegíveis sem as chaves KMS rotacionadas.

## 2. Isolamento de Rede
O banco de dados NÃO é exposto à Internet pública. Ele opera em uma sub-rede privada, sendo acessível única e exclusivamente pelos Workers do Back-end Node.js autorizados na VPC interna.

## 3. Controle de Acesso Granular (Menor Privilégio)
Para mitigar ameaças internas e ransonwares lógicos, o backend não opera com o superusuário. 
Script implementado:
\`\`\`sql
CREATE ROLE app_user_restricted;
GRANT INSERT ON purchases TO app_user_restricted;
REVOKE DELETE, UPDATE ON purchases FROM app_user_restricted;
\`\`\`
O sistema de aplicação pode APENAS inserir novas compras. É matematicamente impossível para o código da aplicação excluir registros históricos.

## 4. Hashing de Senhas e CVV
Dados ultrassensíveis como senhas ou códigos de segurança (CVV) não são armazenados em texto puro. Utilizamos a biblioteca \`bcrypt\` com Salt auto-gerado de 10 rounds antes do armazenamento, invalidando vazamentos pontuais.

## 5. Mascaramento de Dados (Data Masking)
Para que analistas ou desenvolvedores (com acesso ao DB) não exponham usuários reais, o cartão de crédito completo nunca atinge o banco. O Back-end realiza o mascaramento do número antes da gravação: \`**** **** **** 1234\`.

## 6. Auditoria Forense
Implementamos a tabela \`audit_logs\` que age como trilha imutável. Cada compra gera uma assinatura no log temporal registrando autor, horário e ação executada, satisfazendo os pilares de Rastreabilidade.
