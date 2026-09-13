import { useState } from 'react';
import './App.css';

function App() {
  const [email, setEmail] = useState('');
  const [quantity, setQuantity] = useState('');
  const [submitted, setSubmitted] = useState(false);

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
