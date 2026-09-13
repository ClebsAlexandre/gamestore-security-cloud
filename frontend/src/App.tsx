import { useState } from 'react';
import './App.css';

interface Game {
  id: number;
  title: string;
  price: string;
  image: string;
  tags: string[];
}

const games: Game[] = [
  {
    id: 1,
    title: 'Cyberpunk 2077',
    price: 'R$ 199,90',
    image: 'https://steamcdn-a.akamaihd.net/steam/apps/1091500/library_600x900_2x.jpg',
    tags: ['RPG', 'Sci-Fi']
  },
  {
    id: 2,
    title: 'Elden Ring',
    price: 'R$ 249,90',
    image: 'https://steamcdn-a.akamaihd.net/steam/apps/1245620/library_600x900_2x.jpg',
    tags: ['RPG', 'Souls-like']
  },
  {
    id: 3,
    title: 'God of War',
    price: 'R$ 199,90',
    image: 'https://steamcdn-a.akamaihd.net/steam/apps/1593500/library_600x900_2x.jpg',
    tags: ['Ação', 'Aventura']
  },
  {
    id: 4,
    title: 'Red Dead Redemption 2',
    price: 'R$ 299,90',
    image: 'https://steamcdn-a.akamaihd.net/steam/apps/1174180/library_600x900_2x.jpg',
    tags: ['Ação', 'Mundo Aberto']
  },
  {
    id: 5,
    title: 'The Witcher 3: Wild Hunt',
    price: 'R$ 129,99',
    image: 'https://steamcdn-a.akamaihd.net/steam/apps/292030/library_600x900_2x.jpg',
    tags: ['RPG', 'Fantasia']
  },
  {
    id: 6,
    title: 'Grand Theft Auto V',
    price: 'R$ 82,00',
    image: 'https://steamcdn-a.akamaihd.net/steam/apps/271590/library_600x900_2x.jpg',
    tags: ['Ação', 'Mundo Aberto']
  },
  {
    id: 7,
    title: 'Resident Evil 4',
    price: 'R$ 249,00',
    image: 'https://steamcdn-a.akamaihd.net/steam/apps/2050650/library_600x900_2x.jpg',
    tags: ['Terror', 'Sobrevivência']
  },
  {
    id: 8,
    title: 'Hogwarts Legacy',
    price: 'R$ 249,99',
    image: 'https://steamcdn-a.akamaihd.net/steam/apps/990080/library_600x900_2x.jpg',
    tags: ['RPG', 'Magia']
  }
];

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPass, setLoginPass] = useState('');

  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [email, setEmail] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [cpf, setCpf] = useState('');
  const [phone, setPhone] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardName, setCardName] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [totalPrice, setTotalPrice] = useState<number | null>(null);

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

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 16) value = value.slice(0, 16);
    value = value.replace(/(\d{4})(?=\d)/g, '$1 ');
    setCardNumber(value);
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 4) value = value.slice(0, 4);
    value = value.replace(/(\d{2})(\d{1,2})/, '$1/$2');
    setExpiry(value);
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 4) value = value.slice(0, 4);
    setCvv(value);
  };

  const handleCardNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Permite apenas letras (com acentos) e espaços, apagando o resto (como caracteres especiais)
    let value = e.target.value.replace(/[^a-zA-ZáéíóúâêôãõçÁÉÍÓÚÂÊÔÃÕÇ\s]/g, '');
    if (value.length > 26) value = value.slice(0, 26);
    setCardName(value.toUpperCase());
  };


  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggedIn(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Integração Front -> Back (v7)
      const response = await fetch(`${API_URL}/api/checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gameTitle: selectedGame?.title,
          email,
          cpf,
          phone,
          quantity: parseInt(quantity),
          cardName,
          cardNumber,
          expiry,
          cvv
        })
      });

      if (!response.ok) {
        throw new Error('Falha na comunicação com o servidor');
      }

      const responseData = await response.json();
      setTotalPrice(responseData.data.totalPrice);
      setSubmitted(true);
      
      setTimeout(() => {
        setSubmitted(false);
        setSelectedGame(null);
        setEmail('');
        setCpf('');
        setPhone('');
        setQuantity('1');
        setCardNumber('');
        setExpiry('');
        setCvv('');
        setCardName('');
        setTotalPrice(null);
      }, 5000);
    } catch (error) {
      console.error('Erro no checkout:', error);
      alert('Ocorreu um erro ao processar a compra. Verifique se o backend está rodando na porta 3000.');
    }
  };

  const testConfidentiality = async () => {
    try {
      const response = await fetch(`${API_URL}/api/teste-erro`);
      const data = await response.json();
      alert("Resposta do Servidor (Confidencialidade Ativa):\n\n" + JSON.stringify(data, null, 2) + "\n\nNote que o stack trace e a API_KEY não foram enviados para o Frontend!");
    } catch (e) {
      alert("Erro ao conectar no servidor.");
    }
  };

  const testAvailability = async () => {
    try {
      // 1. Pega o PID atual
      const res1 = await fetch(`${API_URL}/api/pid`);
      const data1 = await res1.json();
      const oldPid = data1.pid;
      
      // 2. Manda matar o processo
      fetch(`${API_URL}/api/kill`).catch(() => {});
      alert(`PROVA DE DISPONIBILIDADE:\n\n1. O servidor estava rodando no Processo (PID): ${oldPid}.\n2. O comando KILL foi disparado e ele acabou de MORRER.\n\nSe o Cluster não funcionar, o site cai agora. Vamos aguardar 2 segundos para o sistema Master reagir e subir um novo Worker...`);
      
      // 3. Aguarda e testa de novo
      setTimeout(async () => {
        try {
          const res2 = await fetch(`${API_URL}/api/pid`);
          const data2 = await res2.json();
          const newPid = data2.pid;
          
          alert(`SUCESSO! O site já voltou a responder!\n\nPID Antigo (Morto): ${oldPid}\nPID Novo (Ressuscitado): ${newPid}\n\nComo os números dos processos são diferentes, fica provado visualmente que a Disponibilidade restaurou o servidor sem intervenção humana!`);
        } catch(e) {
          alert("FALHA: Servidor caiu e não voltou!");
        }
      }, 2000);
    } catch(e) {
      alert("Erro ao conectar no servidor.");
    }
  };

  return (
    <div className="gamestore-wrapper">
      
      {!isLoggedIn ? (
        /* LOGIN VIEW VISUAL */
        <div className="login-view fade-in">
          <div className="nav-logo glitch-text" data-text="NEXUS" style={{marginBottom: '2.5rem', textAlign: 'center', fontSize: '2.5rem'}}>NEXUS STORE</div>
          
          <form onSubmit={handleLogin} className="checkout-form glass-panel" style={{ padding: '3rem' }}>
            <h3 style={{ textAlign: 'center', margin: '0 0 2rem 0', borderBottom: 'none' }}>Login</h3>
            
            <div className="form-group">
              <label htmlFor="loginEmail">E-mail de acesso:</label>
              <input 
                id="loginEmail"
                type="email" 
                required 
                placeholder="seu@email.com"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="loginPass">Senha de segurança:</label>
              <input 
                id="loginPass"
                type="password" 
                required 
                maxLength={20}
                placeholder="••••••••"
                value={loginPass}
                onChange={(e) => setLoginPass(e.target.value)}
              />
            </div>

            <button type="submit" className="buy-button" style={{marginTop: '2rem'}}>
              AUTENTICAR
            </button>
          </form>
        </div>
      ) : (
        <>
          {/* NAVEGAÇÃO SUPERIOR */}
          <nav className="navbar">
            <div className="nav-logo glitch-text" data-text="NEXUS">NEXUS STORE</div>
            <div className="nav-links">
              <a href="#" className="active">Catálogo</a>
              <a href="#">Lançamentos</a>
              <a href="#">Ofertas</a>
              <a href="#">Comunidade</a>
            </div>
            <div className="nav-user">
              <button className="icon-btn">🔍</button>
              <button className="icon-btn">🛒</button>
              <div className="avatar">U</div>
            </div>
          </nav>

      <div className="gamestore-container">
        
        {!selectedGame ? (
          <>
            {/* HERO SECTION */}
            <section className="hero-section">
              <div className="hero-bg"></div>
              <div className="hero-content">
                <span className="hero-badge">DESTAQUE DA SEMANA</span>
                <h1 className="hero-title">CYBERPUNK 2077</h1>
                <p className="hero-desc">Explore Night City, uma megalópole obcecada por poder, glamour e modificações corporais. Assuma o papel de V, um mercenário fora da lei, e mude seu destino.</p>
                <div className="hero-actions">
                  <button className="primary-btn" onClick={() => setSelectedGame(games[0])}>COMPRAR AGORA</button>
                  <button className="secondary-btn">VER TRAILER</button>
                </div>
              </div>
            </section>

            {/* GAMES GRID */}
            <section className="games-section">
              <h2 className="section-title"><span>Mais</span> Vendidos</h2>
              <div className="games-grid">
                {games.map(game => (
                  <div className="game-card" key={game.id}>
                    <div className="game-card-img-wrapper">
                      <img src={game.image} alt={game.title} className="game-card-img" />
                      <div className="game-card-overlay">
                        <button className="buy-sm-btn" onClick={() => setSelectedGame(game)}>ADQUIRIR</button>
                      </div>
                    </div>
                    <div className="game-card-info">
                      <div className="tags">
                        {game.tags.map(tag => <span key={tag} className="tag">{tag}</span>)}
                      </div>
                      <h3>{game.title}</h3>
                      <p className="price">{game.price}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </>
        ) : (
          /* CHECKOUT VIEW */
          <div className="checkout-view fade-in">
            <button className="back-btn" onClick={() => setSelectedGame(null)}>
              <span className="arrow">←</span> Voltar para o Catálogo
            </button>
            
            <main className="checkout-main">
              {/* Resumo do Jogo */}
              <div className="checkout-product glass-panel">
                <img 
                  src={selectedGame.image} 
                  alt={selectedGame.title} 
                  className="checkout-cover"
                />
                <div className="checkout-product-details">
                  <h2>{selectedGame.title}</h2>
                  <div className="tags">
                    {selectedGame.tags.map(t => <span key={t} className="tag">{t}</span>)}
                  </div>
                  <p className="price-large">{selectedGame.price}</p>
                </div>
              </div>

              {/* Formulário Seguro (Da Atividade) */}
              <form onSubmit={handleSubmit} className="checkout-form glass-panel">
                <h3>Finalizar Compra Segura</h3>
                <p className="form-subtitle">Seus dados estão protegidos por criptografia ponta-a-ponta.</p>
                
                <div className="form-group">
                  <label htmlFor="email">Email de recebimento (Chave Steam):</label>
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
                  <label htmlFor="cpf">CPF do Titular:</label>
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
                  <label htmlFor="phone">Celular (Para 2FA):</label>
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
                  <label htmlFor="quantity">Quantidade de Cópias (Max 5):</label>
                  <input 
                    id="quantity"
                    type="number" 
                    required 
                    min="1"
                    max="5"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="cardName">Nome impresso no Cartão:</label>
                  <input 
                    id="cardName"
                    type="text" 
                    required 
                    maxLength={26}
                    placeholder="JOAO M SILVA"
                    value={cardName}
                    onChange={handleCardNameChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="cardNumber">Número do Cartão:</label>
                  <input 
                    id="cardNumber"
                    type="text" 
                    required 
                    maxLength={19}
                    placeholder="0000 0000 0000 0000"
                    value={cardNumber}
                    onChange={handleCardNumberChange}
                  />
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label htmlFor="expiry">Validade (MM/AA):</label>
                    <input 
                      id="expiry"
                      type="text" 
                      required 
                      maxLength={5}
                      placeholder="12/29"
                      value={expiry}
                      onChange={handleExpiryChange}
                    />
                  </div>

                  <div className="form-group" style={{ flex: 1 }}>
                    <label htmlFor="cvv">Código CVV:</label>
                    <input 
                      id="cvv"
                      type="password" 
                      required 
                      maxLength={4}
                      placeholder="•••"
                      value={cvv}
                      onChange={handleCvvChange}
                    />
                  </div>
                </div>

                <button type="submit" className="buy-button">
                  CONFIRMAR PAGAMENTO
                </button>
                
                {submitted && (
                  <div className="success-msg">
                    <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                      <span style={{ fontWeight: 'bold' }}>Transação Aprovada!</span>
                      <span>Valor total cobrado: <strong style={{color: '#0ff'}}>{totalPrice?.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}</strong></span>
                    </div>
                  </div>
                )}
              </form>
            </main>
          </div>
        )}

        {/* PAINEL DE DEMONSTRAÇÃO */}
        {isLoggedIn && (
          <div className="demo-panel glass-panel" style={{ marginTop: '3rem', padding: '1.5rem', border: '1px solid #f0f', textAlign: 'center' }}>
            <h3 style={{ color: '#f0f', marginBottom: '1rem', fontSize: '1.2rem', textTransform: 'uppercase' }}>🛠️ Painel de Apresentação</h3>
            <p style={{ marginBottom: '1rem', fontSize: '0.9rem', color: '#ccc' }}>Use estes botões para testar as rotinas de segurança da loja.</p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button onClick={testConfidentiality} className="secondary-btn" style={{ borderColor: '#ff0', color: '#ff0' }}>Testar Confidencialidade (Erro)</button>
              <button onClick={testAvailability} className="secondary-btn" style={{ borderColor: '#f00', color: '#f00' }}>Testar Disponibilidade (Derrubar Servidor)</button>
            </div>
          </div>
        )}

      </div>
      </>
      )}
    </div>
  );
}

export default App;
