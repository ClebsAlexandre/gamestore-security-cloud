import { useState } from 'react';
import './App.css';

function App() {
  const [email, setEmail] = useState('');
  const [quantity, setQuantity] = useState('');
  const [cpf, setCpf] = useState('');
  const [phone, setPhone] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 11) value = value.slice(0, 11);
    value = value
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2');
    setCpf(value);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 11) value = value.slice(0, 11);
    value = value
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2');
    setPhone(value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate frontend validation pass
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="gamestore-container">
      <header className="header">
        <h1>🎮 GameStore Cloud</h1>
        <p>Compre o novo CyberQuest 2077 - Edição Digital</p>
      </header>

      <main className="checkout-main">
        <div className="product-card">
          <div className="product-image"></div>
          <h2>CyberQuest 2077</h2>
          <p className="price">R$ 299,00</p>
        </div>

        <form onSubmit={handleSubmit} className="checkout-form">
          <h3>Checkout Rápido</h3>
          
          <div className="form-group">
            <label htmlFor="email">Email para recebimento da chave:</label>
            {/* Checklist: Tipagem de Input (email) e Campo Obrigatório */}
            <input 
              id="email"
              type="email" 
              required 
              placeholder="seu.email@exemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="cpf">CPF do Titular (Máscara e Limite):</label>
            {/* Checklist: Máscaras de Entrada e Limite de Caracteres (Buffer Overflow) */}
            <input 
              id="cpf"
              type="text" 
              required 
              maxLength={14}
              placeholder="000.000.000-00"
              value={cpf}
              onChange={handleCpfChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone">Telefone (Máscara e Limite):</label>
            {/* Checklist: Máscaras de Entrada e Limite de Caracteres (Buffer Overflow) */}
            <input 
              id="phone"
              type="text" 
              required 
              maxLength={15}
              placeholder="(00) 00000-0000"
              value={phone}
              onChange={handlePhoneChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="quantity">Quantidade de Cópias:</label>
            {/* Checklist: Tipagem de Input (number) e Campo Obrigatório */}
            <input 
              id="quantity"
              type="number" 
              required 
              min="1"
              max="5"
              placeholder="1"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
          </div>

          <button type="submit" className="buy-button">Finalizar Compra</button>
          
          {submitted && (
            <div className="success-msg">✅ Estado validado e compra enviada!</div>
          )}
        </form>
      </main>
    </div>
  );
}

export default App;
