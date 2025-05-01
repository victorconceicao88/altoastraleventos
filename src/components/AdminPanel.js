import { useState, useEffect } from 'react';
import { ref, onValue, update, push, remove } from 'firebase/database';
import { database } from '../firebase';

const AdminPanel = () => {
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);
  const [message, setMessage] = useState('');
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [showConfetti, setShowConfetti] = useState(false);
  const [newOrderAlert, setNewOrderAlert] = useState(null);
  const [audioEnabled, setAudioEnabled] = useState(false); // Adicione esta linha

  // Efeito sonoro (apenas HTML5 Audio API)
  const playSound = (sound) => {
    const audio = new Audio(sound);
    audio.volume = 0.3;
    audio.play().catch(e => console.log("Autoplay bloqueado:", e));
  };

  useEffect(() => {
    const tablesRef = ref(database, 'tables');
    onValue(tablesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const tablesData = Object.entries(data).map(([id, table]) => ({
          id,
          currentOrder: table.currentOrder ? Object.values(table.currentOrder)[0] : null,
          messages: table.messages || []
        }));

        // Detecta novo pedido
        const newOrder = tablesData.find(t => 
          t.currentOrder && 
          !tables.find(oldTable => 
            oldTable.id === t.id && oldTable.currentOrder
          )
        );

        if (newOrder) {
          setNewOrderAlert(newOrder.id);
          playSound('https://assets.mixkit.co/sfx/preview/mixkit-positive-interface-beep-221.mp3');
          setTimeout(() => setNewOrderAlert(null), 3000);
        }

        setTables(tablesData);
        if (isInitialLoad) setIsInitialLoad(false);
      }
    });
  }, [isInitialLoad]);

  const updateOrderStatus = (tableId, status) => {
    const orderRef = ref(database, `tables/${tableId}/currentOrder`);
    update(orderRef, { status });
    
    if (status === 'Finalizado') {
      setShowConfetti(true);
      playSound('https://assets.mixkit.co/sfx/preview/mixkit-achievement-bell-600.mp3');
      setTimeout(() => {
        setShowConfetti(false);
        remove(orderRef);
      }, 3000);
    }
  };

  const sendMessage = (tableId) => {
    if (!message.trim()) return;
    const messagesRef = ref(database, `tables/${tableId}/messages`);
    push(messagesRef, message);
    playSound('https://assets.mixkit.co/sfx/preview/mixkit-message-pop-alert-2354.mp3');
    setMessage('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Efeito Confetti (CSS puro) */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-yellow-400 rounded-full animate-confetti"
              style={{
                left: `${Math.random() * 100}vw`,
                animationDelay: `${Math.random() * 2}s`,
                transform: `rotate(${Math.random() * 360}deg)`,
              }}
            />
          ))}
        </div>
      )}
  
      {/* Botão de controle de áudio */}
      <div className="fixed bottom-4 right-4 z-50">
        <button 
          onClick={() => {
            setAudioEnabled(!audioEnabled);
            playSound('click');
          }}
          className={`p-3 rounded-full shadow-lg transition-all duration-300 ${
            audioEnabled ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'
          } text-white flex items-center gap-2`}
        >
          {audioEnabled ? (
            <>
              <span className="animate-pulse">🔊</span>
              <span>Som ON</span>
            </>
          ) : (
            <>
              <span>🔇</span>
              <span>Som OFF</span>
            </>
          )}
        </button>
      </div>
  
      <header className={`bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 shadow-lg transform transition-all duration-500 ${
        isInitialLoad ? '-translate-y-full' : 'translate-y-0'
      }`}>
        <div className="container mx-auto relative">
          <h1 className="text-3xl font-bold tracking-tight animate-pulse">✨ PAINEL DO GARÇOM HYPER ✨</h1>
          <p className="text-indigo-100 mt-1 transition-opacity duration-1000 opacity-0 animate-fade-in">
            Controle de mesas em tempo real
          </p>
        </div>
      </header>
  
      <div className="flex container mx-auto">
        {/* Sidebar de Mesas */}
        <div className={`w-1/4 bg-white shadow-xl rounded-r-lg h-[calc(100vh-5rem)] mt-6 overflow-y-auto sticky top-6 transition-all duration-700 ${
          isInitialLoad ? '-translate-x-full opacity-0' : 'translate-x-0 opacity-100'
        }`}>
          <div className="p-4 bg-gradient-to-r from-indigo-500 to-purple-500 text-white sticky top-0 z-10">
            <h2 className="text-xl font-bold">Mesas (1-50)</h2>
          </div>
          <div className="grid grid-cols-2 gap-3 p-4">
            {Array.from({ length: 50 }, (_, i) => i + 1).map((tableNumber, index) => {
              const table = tables.find(t => t.id === tableNumber.toString());
              const hasOrder = table?.currentOrder;
              const orderTotal = hasOrder ? 
                table.currentOrder.items.reduce((sum, item) => sum + item.price, 0) : 
                0;
              
              return (
                <button
                  key={tableNumber}
                  onClick={() => {
                    setSelectedTable(tableNumber.toString());
                    playSound('click');
                  }}
                  className={`p-3 rounded-xl transition-all duration-300 hover:scale-105 active:scale-95 ${
                    selectedTable === tableNumber.toString() 
                      ? 'bg-indigo-100 border-2 border-indigo-500 shadow-md' 
                      : 'bg-gray-50 hover:bg-gray-100'
                  } ${
                    hasOrder ? 'ring-2 ring-red-500 animate-pulse' : ''
                  } ${
                    hasOrder && orderTotal > 100 ? 'shadow-gold bg-gradient-to-br from-yellow-100 to-yellow-50' : ''
                  } relative overflow-hidden transform hover:-translate-y-1 hover:shadow-lg`}
                  style={{
                    transitionDelay: `${index * 20}ms`,
                    opacity: isInitialLoad ? 0 : 1,
                    transform: isInitialLoad ? 'translateY(20px)' : 'translateY(0)'
                  }}
                >
                  {hasOrder && (
                    <>
                      <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full transform translate-x-1 -translate-y-1 animate-ping" />
                      {newOrderAlert === tableNumber.toString() && (
                        <span className="absolute top-0 left-0 w-full h-full bg-yellow-400/10 animate-flash" />
                      )}
                    </>
                  )}
                  <span className="font-medium">Mesa {tableNumber}</span>
                  {hasOrder && (
                    <span className={`ml-2 text-xs px-2 py-1 rounded-full inline-block ${
                      orderTotal > 100 ? 
                        'bg-yellow-500 text-white animate-bounce' : 
                        'bg-red-500 text-white animate-pulse'
                    }`}>
                      {orderTotal > 100 ? 'VIP!' : 'Novo Pedido'}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
  
        {/* Painel Principal */}
        <div className="flex-1 p-6">
          {selectedTable ? (
            <div 
              key={selectedTable}
              className="space-y-6 animate-fade-in-up"
            >
              <div 
                className="bg-white rounded-2xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl"
              >
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mr-4 animate-spin-slow">
                    <span className="text-2xl">🍽️</span>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800">Mesa {selectedTable}</h2>
                  {tables.find(t => t.id === selectedTable)?.currentOrder?.status === 'Pronto' && (
                    <span className="ml-auto bg-green-500 text-white px-3 py-1 rounded-full text-sm animate-pulse">
                      PRONTO PARA ENTREGAR!
                    </span>
                  )}
                </div>
                
                {tables.find(t => t.id === selectedTable)?.currentOrder ? (
                  <div className="mb-6 border-b border-gray-200 pb-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-bold text-lg text-gray-700">Pedido Atual</h3>
                      <select
                        value={tables.find(t => t.id === selectedTable).currentOrder.status}
                        onChange={(e) => updateOrderStatus(selectedTable, e.target.value)}
                        className="bg-gray-100 p-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all hover:scale-105"
                      >
                        <option value="Recebido">Recebido</option>
                        <option value="Em preparo">Em preparo</option>
                        <option value="Pronto">Pronto</option>
                        <option value="Entregue">Entregue</option>
                        <option value="Finalizado">Finalizado</option>
                      </select>
                    </div>
                    
                    <div className="space-y-3">
                      {tables.find(t => t.id === selectedTable).currentOrder.items.map((item, j) => (
                        <div 
                          key={j}
                          className="flex justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all duration-200 hover:translate-x-2"
                          style={{
                            transitionDelay: `${j * 50}ms`
                          }}
                        >
                          <span className="font-medium">{item.name}</span>
                          <span className="text-indigo-600 font-semibold">R$ {item.price.toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="flex justify-between font-bold mt-4 pt-3 border-t border-gray-200 animate-pulse">
                      <span className="text-lg">Total:</span>
                      <span className={`text-xl ${
                        tables.find(t => t.id === selectedTable).currentOrder.items.reduce((sum, item) => sum + item.price, 0) > 100 ?
                          'text-yellow-600' : 'text-indigo-600'
                      }`}>
                        R$ {tables.find(t => t.id === selectedTable).currentOrder.items
                          .reduce((sum, item) => sum + item.price, 0)
                          .toFixed(2)}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 animate-bounce">
                    <div className="text-5xl mb-4">🍽️</div>
                    <p className="text-gray-500 text-lg">Nenhum pedido ativo para esta mesa.</p>
                  </div>
                )}
              </div>
  
              <div className="bg-white rounded-2xl shadow-lg p-6 animate-fade-in">
                <h3 className="font-bold text-lg mb-4 text-gray-700">Enviar Mensagem</h3>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Digite uma mensagem..."
                    className="flex-1 border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all hover:scale-105 focus:scale-105"
                  />
                  <button
                    onClick={() => sendMessage(selectedTable)}
                    className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-6 rounded-xl shadow-md hover:shadow-lg transition-all hover:scale-105 active:scale-95 hover:brightness-110"
                  >
                    Enviar
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div 
              className="bg-white rounded-2xl shadow-lg p-12 text-center flex flex-col items-center justify-center h-[60vh] animate-pulse"
            >
              <div className="text-6xl mb-6 animate-bounce">
                👨‍🍳
              </div>
              <h3 className="text-2xl font-bold text-gray-700 mb-2">Selecione uma mesa</h3>
              <p className="text-gray-500 max-w-md animate-pulse">
                Escolha uma mesa à esquerda para visualizar os detalhes do pedido e enviar mensagens
              </p>
              <div className="mt-8 text-gray-400 animate-ping">
                ← Clique em uma mesa
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Estilos de animação personalizados */}
      <style jsx global>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes spinSlow {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes flash {
          0%, 100% { opacity: 0; }
          50% { opacity: 1; }
        }
        @keyframes confetti {
          0% { transform: translateY(-100vh) rotate(0deg); }
          100% { transform: translateY(100vh) rotate(360deg); }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.5s ease-out forwards;
        }
        .animate-fade-in {
          animation: fadeInUp 0.8s ease-out forwards;
        }
        .animate-spin-slow {
          animation: spinSlow 8s linear infinite;
        }
        .animate-flash {
          animation: flash 0.5s ease-in-out 3;
        }
        .animate-confetti {
          animation: confetti 3s linear forwards;
        }
        .shadow-gold {
          box-shadow: 0 0 15px rgba(255, 215, 0, 0.7);
        }
      `}</style>
    </div>
  );
};

export default AdminPanel;