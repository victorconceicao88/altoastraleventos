import { useState, useEffect } from 'react';
import { ref, onValue, push } from 'firebase/database';
import { database } from '../firebase';
import { menu } from '../menuData';

const ClientInterface = ({ tableNumber }) => {
  const [cart, setCart] = useState([]);
  const [orderStatus, setOrderStatus] = useState(null);
  const [activeCategory, setActiveCategory] = useState('semana');
  const [messages, setMessages] = useState([]);

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