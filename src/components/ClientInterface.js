import { useState, useEffect } from 'react';
import { ref, onValue, push } from 'firebase/database';
import { database } from '../firebase';

const ClientInterface = ({ tableNumber }) => {
  const [cart, setCart] = useState([]);
  const [orderStatus, setOrderStatus] = useState(null);
  const [activeCategory, setActiveCategory] = useState('semana');
  const [messages, setMessages] = useState([]);

  const foodImages = {
    frangoCremoso: '/imagens/frango-cremoso.jpg',
    picanhaPremium: '/imagens/picanha-premium.jpg',
    costelaRaiz: '/imagens/costela-raiz.jpg',
    feijoada: '/imagens/feijoada.jpg',
    hamburguer: '/imagens/hamburguer.jpg',
    batataFrita: '/imagens/batata-frita.jpg',
    pastel: '/imagens/pastel.jpg',
    cafe: '/imagens/cafe.jpg',
    bebida: '/imagens/bebida.jpg',
    salgado: '/imagens/salgado.jpg',
    sobremesa: '/imagens/sobremesa.jpg'
  };

  const menu = {
    semana: [
      { id: 1, name: 'Frango Cremoso', description: 'Strogonoff de frango, arroz branco, salada e batata palha', price: 12.90, veg: false, image: foodImages.frangoCremoso, rating: 4.5 },
      { id: 2, name: 'Picanha Premium', description: 'Picanha grelhada, arroz branco, feijão tropeiro e vinagrete', price: 15.90, veg: false, image: foodImages.picanhaPremium, rating: 4.8 },
      { id: 3, name: 'Costela Raiz', description: 'Costela de vaca com mandioca, arroz branco, farofa e salada', price: 14.90, veg: false, image: foodImages.costelaRaiz, rating: 4.7 },
      { id: 4, name: 'Frango Supremo', description: 'Filé de frango à parmegiana, arroz branco, batata frita e salada', price: 13.90, veg: false, image: foodImages.frangoCremoso, rating: 4.3 },
      { id: 5, name: 'Feijoada Astral', description: 'Feijoada brasileira, arroz branco, couve, farofa, torresmo e laranja', price: 12.90, veg: false, image: foodImages.feijoada, rating: 4.9 },
      { id: 6, name: 'Opção Vegetariana', description: 'Prato vegetariano sob consulta - acompanha bebida e café', price: 12.90, veg: true, image: foodImages.frangoCremoso, rating: 4.2 }
    ],
    lanches: [
      { id: 7, name: 'Hambúrguer com Fritas', description: 'Carne, alface, tomate, cebola, cheddar, molho da casa', price: 7.00, image: foodImages.hamburguer, rating: 4.4 },
      { id: 8, name: 'Hambúrguer Alto Astral', description: 'Carne 120g, bacon, queijo, anéis de cebola, alface, tomate, cheddar, molho coquetel e especial', price: 9.90, image: foodImages.hamburguer, rating: 4.7 },
      { id: 9, name: 'Hambúrguer Neg\'s', description: 'Carne 120g, frango panado, bacon, queijo, anéis de cebola, cebola crispy, alface, tomate, cheddar, molho coquetel e especial', price: 12.90, image: foodImages.hamburguer, rating: 4.9 },
      { id: 10, name: 'Sandes de Panado', description: 'Frango panado, alface, tomate, cebola, molho da casa', price: 5.50, image: foodImages.hamburguer, rating: 4.1 },
      { id: 11, name: 'Tostas Premium', description: 'Frango ou atum acompanha queijo, alface, tomate e cebola roxa', price: 6.50, image: foodImages.hamburguer, rating: 4.0 },
      { id: 12, name: 'Sandes Natural', description: 'Patê de frango, queijo, rúcula, tomate, cebola roxa e cenoura ralada', price: 6.50, image: foodImages.hamburguer, rating: 3.9 }
    ],
    porcoes: [
      { id: 13, name: 'Batata Frita', description: 'Porção com 400g de batata frita', price: 4.00, image: foodImages.batataFrita, rating: 4.2 },
      { id: 14, name: 'Fritas com Bacon e Queijo', description: 'Porção com 400g de batatas com bacon e queijo cheddar', price: 6.50, image: foodImages.batataFrita, rating: 4.6 },
      { id: 15, name: 'Chouriça com Cebola', description: 'Porção com 600g de chouriça acebolada e pão fatiado', price: 9.00, image: foodImages.batataFrita, rating: 4.5 },
      { id: 16, name: 'Asinha de Frango', description: 'Porção com 700g de asinhas de frango e molho barbecue', price: 12.00, image: foodImages.batataFrita, rating: 4.4 },
      { id: 17, name: 'Costelinha', description: 'Porção com 800g de costelinha e molho barbecue', price: 12.00, image: foodImages.batataFrita, rating: 4.7 },
      { id: 18, name: 'Picanha com Fritas', description: 'Porção com 600g de tiras de picanha temperada com sal de parrilha e acompanhado de batata frita ou doce', price: 18.00, image: foodImages.batataFrita, rating: 4.8 },
      { id: 19, name: 'Filé de Tilápia', description: 'Porção com 800g de filé de tilápia e molho tartaro', price: 14.00, image: foodImages.batataFrita, rating: 4.3 }
    ],
    pasteis: [
      { id: 20, name: 'Pastel Simples', description: 'Frango desfiado, carne picada ou queijo', price: 5.00, image: foodImages.pastel, rating: 4.3 },
      { id: 21, name: 'Pastel de Frango com Queijo', description: 'Frango desfiado com queijo', price: 5.50, image: foodImages.pastel, rating: 4.5 },
      { id: 22, name: 'Pastel de Frango com Queijo e Bacon', description: 'Frango desfiado com queijo e bacon em cubos', price: 6.50, image: foodImages.pastel, rating: 4.7 },
      { id: 23, name: 'Pastel de Carne com Queijo', description: 'Carne picada com queijo e azeitona', price: 5.50, image: foodImages.pastel, rating: 4.4 },
      { id: 24, name: 'Pastel de Carne com Queijo e Bacon', description: 'Carne picada com queijo, azeitona e bacon em cubos', price: 6.50, image: foodImages.pastel, rating: 4.6 },
      { id: 25, name: 'Pastel de Chouriça', description: 'Queijo, chouriça e milho', price: 5.50, image: foodImages.pastel, rating: 4.2 },
      { id: 26, name: 'Pastel Misto', description: 'Fiambre, queijo, azeitona e milho', price: 5.50, image: foodImages.pastel, rating: 4.1 },
      { id: 27, name: 'Pastel de Pizza', description: 'Queijo, fiambre, tomate e orégano', price: 5.50, image: foodImages.pastel, rating: 4.0 },
      { id: 28, name: 'Pastel Alto Astral', description: 'Queijo, bacon, tomate, azeitona, cheddar e orégano', price: 6.50, image: foodImages.pastel, rating: 4.8 },
      { id: 29, name: 'Pastel Romeu e Julieta', description: 'Queijo com goiabada', price: 5.50, image: foodImages.pastel, rating: 4.7 },
      { id: 30, name: 'Pastel de Banana com Nutela', description: 'Queijo, banana e nutella', price: 6.00, image: foodImages.pastel, rating: 4.9 }
    ],
    cafe: [
      { id: 31, name: 'Café Expresso', price: 1.00, image: foodImages.cafe, rating: 4.5 },
      { id: 32, name: 'Café Descafeinado', price: 1.00, image: foodImages.cafe, rating: 4.3 },
      { id: 33, name: 'Café Duplo', price: 2.00, image: foodImages.cafe, rating: 4.6 },
      { id: 34, name: 'Garoto', price: 1.00, image: foodImages.cafe, rating: 4.2 },
      { id: 35, name: 'Abatanado', price: 1.10, image: foodImages.cafe, rating: 4.1 },
      { id: 36, name: 'Meia de Leite', price: 1.50, image: foodImages.cafe, rating: 4.4 },
      { id: 37, name: 'Galão', price: 1.60, image: foodImages.cafe, rating: 4.5 },
      { id: 38, name: 'Chá', price: 1.60, image: foodImages.cafe, rating: 4.0 },
      { id: 39, name: 'Cappuccino', price: 3.00, image: foodImages.cafe, rating: 4.7 },
      { id: 40, name: 'Caricoa de Limão', price: 1.00, image: foodImages.cafe, rating: 3.9 },
      { id: 41, name: 'Chocolate Quente', price: 3.00, image: foodImages.cafe, rating: 4.8 },
      { id: 42, name: 'Torrada com Pão Caseiro', price: 2.00, image: foodImages.cafe, rating: 4.3 },
      { id: 43, name: 'Torrada com Pão de Forma', price: 1.50, image: foodImages.cafe, rating: 4.1 },
      { id: 44, name: 'Meia Torrada', price: 1.00, image: foodImages.cafe, rating: 4.0 },
      { id: 45, name: 'Croissant Misto', price: 3.00, image: foodImages.cafe, rating: 4.6 },
      { id: 46, name: 'Croissant Misto Tostado', price: 3.20, image: foodImages.cafe, rating: 4.7 },
      { id: 47, name: 'Tosta Mista', price: 3.20, image: foodImages.cafe, rating: 4.5 },
      { id: 48, name: 'Tosta Mista (Pão de Forma)', price: 2.80, image: foodImages.cafe, rating: 4.4 },
      { id: 49, name: 'Sandes Mista', price: 2.20, image: foodImages.cafe, rating: 4.2 },
      { id: 50, name: 'Pão com Ovo', price: 2.20, image: foodImages.cafe, rating: 4.1 },
      { id: 51, name: 'Ovos com Bacon', price: 4.00, image: foodImages.cafe, rating: 4.7 }
    ],
    bebidas: [
      { id: 52, name: 'Caipirinha', description: 'Cachaça 51 ou Velho Barreiro, lima, açúcar e gelo', price: 6.00, image: foodImages.bebida, rating: 4.8 },
      { id: 53, name: 'Caipiblack', description: 'Cachaça preta, lima, açúcar e gelo', price: 6.00, image: foodImages.bebida, rating: 4.9 },
      { id: 54, name: 'Whiskey Jamenson', price: 3.50, image: foodImages.bebida, rating: 4.7 },
      { id: 55, name: 'Whiskey J&B', price: 3.00, image: foodImages.bebida, rating: 4.5 },
      { id: 56, name: 'Whiskey Jack Daniels', price: 3.50, image: foodImages.bebida, rating: 4.8 },
      { id: 57, name: 'Whiskey Black Label', price: 4.00, image: foodImages.bebida, rating: 4.9 },
      { id: 58, name: 'Vodka', price: 4.00, image: foodImages.bebida, rating: 4.6 },
      { id: 59, name: 'Somersby', price: 2.50, image: foodImages.bebida, rating: 4.4 },
      { id: 60, name: 'Imperial Heineken (0.20)', price: 1.50, image: foodImages.bebida, rating: 4.5 },
      { id: 61, name: 'Caneca Heineken (0.50)', price: 3.00, image: foodImages.bebida, rating: 4.7 },
      { id: 62, name: 'Cerveja Garrafa (0.33ml)', price: 1.40, image: foodImages.bebida, rating: 4.3 },
      { id: 63, name: 'Cerveja Mini (0.20ml)', price: 1.10, image: foodImages.bebida, rating: 4.2 },
      { id: 64, name: 'Taça de Sangria', description: 'Sangria branca, rosé ou tinta', price: 6.00, image: foodImages.bebida, rating: 4.8 },
      { id: 65, name: 'Refrigerante Lata', price: 1.60, image: foodImages.bebida, rating: 4.1 },
      { id: 66, name: 'Água 1.5L', price: 1.50, image: foodImages.bebida, rating: 4.0 },
      { id: 67, name: 'Água 0.5L', price: 1.00, image: foodImages.bebida, rating: 4.0 },
      { id: 68, name: 'Água 0.33L', price: 0.60, image: foodImages.bebida, rating: 4.0 },
      { id: 69, name: 'Água Castelo', price: 1.40, image: foodImages.bebida, rating: 4.2 },
      { id: 70, name: 'Água das Pedras', price: 1.40, image: foodImages.bebida, rating: 4.3 }
    ],
    salgados: [
      { id: 71, name: 'Pão de Queijo', price: 1.60, image: foodImages.salgado, rating: 4.5 },
      { id: 72, name: 'Pastel de Nata', price: 1.30, image: foodImages.salgado, rating: 4.7 },
      { id: 73, name: 'Empada de Frango', price: 2.00, image: foodImages.salgado, rating: 4.4 },
      { id: 74, name: 'Kibe', price: 2.20, image: foodImages.salgado, rating: 4.3 },
      { id: 75, name: 'Fiambre e Queijo', price: 2.20, image: foodImages.salgado, rating: 4.2 },
      { id: 76, name: 'Bauru', price: 2.20, image: foodImages.salgado, rating: 4.1 },
      { id: 77, name: 'Bola de Queijo', price: 2.20, image: foodImages.salgado, rating: 4.3 },
      { id: 78, name: 'Coxinha de Frango', price: 2.20, image: foodImages.salgado, rating: 4.6 },
      { id: 79, name: 'Coxinha com Catupiry', price: 3.00, image: foodImages.salgado, rating: 4.8 },
      { id: 80, name: 'Hamburgão', price: 3.50, image: foodImages.salgado, rating: 4.7 }
    ],
    sobremesas: [
      { id: 81, name: 'Bolo no Pote - Prestígio', description: 'Chocolate com coco', price: 4.00, image: foodImages.sobremesa, rating: 4.8 },
      { id: 82, name: 'Bolo no Pote - Chocolate', description: 'Massa de chocolate com recheio de chocolate', price: 4.00, image: foodImages.sobremesa, rating: 4.9 },
      { id: 83, name: 'Bolo no Pote - Ananás', description: 'Creme de ninho com pedaços de ananás', price: 4.00, image: foodImages.sobremesa, rating: 4.7 },
      { id: 84, name: 'Bolo no Pote - Choco Misto', description: 'Chocolate preto com ninho', price: 4.00, image: foodImages.sobremesa, rating: 4.8 },
      { id: 85, name: 'Cheesecake - Goiabada', price: 3.50, image: foodImages.sobremesa, rating: 4.7 },
      { id: 86, name: 'Cheesecake - Frutos Vermelhos', price: 3.50, image: foodImages.sobremesa, rating: 4.8 },
      { id: 87, name: 'Brigadeiro Tradicional', price: 1.50, image: foodImages.sobremesa, rating: 4.6 },
      { id: 88, name: 'Brigadeiro Beijinho', price: 1.50, image: foodImages.sobremesa, rating: 4.5 },
      { id: 89, name: 'Brigadeiro Ninho', price: 2.00, image: foodImages.sobremesa, rating: 4.8 },
      { id: 90, name: 'Brigadeiro Paçoca', price: 2.00, image: foodImages.sobremesa, rating: 4.7 },
      { id: 91, name: 'Brigadeiro Morango', price: 2.00, image: foodImages.sobremesa, rating: 4.8 },
      { id: 92, name: 'Brigadeiro Churros', price: 2.00, image: foodImages.sobremesa, rating: 4.9 },
      { id: 93, name: 'Tarte de Toblerone', price: 2.20, image: foodImages.sobremesa, rating: 4.7 },
      { id: 94, name: 'Bolo de Brigadeiro (fatia)', price: 2.20, image: foodImages.sobremesa, rating: 4.8 }
    ]
  };

  useEffect(() => {
    const ordersRef = ref(database, `tables/${tableNumber}/orders`);
    onValue(ordersRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setOrderStatus(data.status || 'Seu pedido foi recebido');
      }
    });

    const messagesRef = ref(database, `tables/${tableNumber}/messages`);
    onValue(messagesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setMessages(Object.values(data));
      }
    });
  }, [tableNumber]);

  const addToCart = (item) => {
    setCart([...cart, { ...item, id: Date.now() }]);
  };

  const removeFromCart = (id) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const sendOrder = () => {
    const orderRef = ref(database, `tables/${tableNumber}/orders`);
    push(orderRef, {
      items: cart,
      status: 'Em preparo',
      timestamp: Date.now()
    });
    setCart([]);
    setOrderStatus('Pedido enviado com sucesso!');
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      {/* Header */}
      <header className="bg-indigo-600 text-white p-4 shadow-md">
        <h1 className="text-2xl font-bold">Mesa {tableNumber}</h1>
        {orderStatus && (
          <div className="text-sm bg-indigo-700 p-2 rounded mt-2">
            Status: {orderStatus}
          </div>
        )}
      </header>

      {/* Menu Categories */}
      <div className="flex overflow-x-auto bg-white shadow-sm sticky top-0 z-10">
        {Object.keys(menu).map(category => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`px-4 py-2 whitespace-nowrap ${activeCategory === category ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-gray-600'}`}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </button>
        ))}
      </div>

      {/* Menu Items */}
      <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        {menu[activeCategory].map(item => (
          <div key={item.id} className="bg-white rounded-lg shadow p-4 flex">
            <div className="flex-1">
              <h3 className="font-bold">{item.name}</h3>
              {item.description && <p className="text-sm text-gray-600">{item.description}</p>}
              <p className="text-indigo-600 font-bold mt-2">R$ {item.price.toFixed(2)}</p>
            </div>
            <button
              onClick={() => addToCart(item)}
              className="bg-indigo-600 text-white p-2 rounded-full h-10 w-10 flex items-center justify-center self-center"
            >
              +
            </button>
          </div>
        ))}
      </div>

      {/* Cart */}
      <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg rounded-t-xl p-4 border-t border-gray-200">
        <h2 className="font-bold text-lg mb-2">Seu Pedido</h2>
        {cart.length === 0 ? (
          <p className="text-gray-500">Seu carrinho está vazio</p>
        ) : (
          <>
            <div className="max-h-40 overflow-y-auto mb-2">
              {cart.map(item => (
                <div key={item.id} className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span>{item.name}</span>
                  <div className="flex items-center">
                    <span className="mr-4">R$ {item.price.toFixed(2)}</span>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-500"
                    >
                      ×
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-between font-bold mt-2">
              <span>Total:</span>
              <span>R$ {cart.reduce((sum, item) => sum + item.price, 0).toFixed(2)}</span>
            </div>
            <button
              onClick={sendOrder}
              className="w-full bg-indigo-600 text-white py-2 rounded-lg mt-4 font-bold"
            >
              Enviar Pedido
            </button>
          </>
        )}
      </div>

      {/* Messages */}
      {messages.length > 0 && (
        <div className="fixed top-20 right-4 bg-white shadow-lg rounded-lg p-4 max-w-xs z-50">
          <h3 className="font-bold mb-2">Mensagens</h3>
          {messages.map((msg, i) => (
            <div key={i} className="bg-indigo-50 p-2 rounded mb-2">
              {msg}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ClientInterface;