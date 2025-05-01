import { useState, useEffect } from 'react';
import { ref, onValue, update, push } from 'firebase/database';
import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { database } from '../firebase';

const AdminPanel = () => {
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const tablesRef = ref(database, 'tables');
    onValue(tablesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const tablesData = Object.entries(data).map(([id, table]) => ({
          id,
          ...table,
          orders: table.orders ? Object.values(table.orders) : []
        }));
        setTables(tablesData);
      }
    });
  }, []);

  const updateOrderStatus = (tableId, orderId, status) => {
    const orderRef = ref(database, `tables/${tableId}/orders/${orderId}/status`);
    update(orderRef, status);
  };

  const sendMessage = (tableId) => {
    if (!message.trim()) return;
    const messagesRef = ref(database, `tables/${tableId}/messages`);
    push(messagesRef, message);
    setMessage('');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-indigo-600 text-white p-4 shadow-md">
        <h1 className="text-2xl font-bold">Painel do Garçom</h1>
      </header>

      <div className="flex">
        {/* Tables List */}
        <div className="w-1/4 bg-white shadow-md h-screen overflow-y-auto">
          <h2 className="p-4 font-bold border-b">Mesas (1-50)</h2>
          <div className="grid grid-cols-2 gap-2 p-2">
            {Array.from({ length: 50 }, (_, i) => i + 1).map(tableNumber => {
              const table = tables.find(t => t.id === tableNumber.toString());
              const hasActiveOrders = table?.orders?.some(o => o.status !== 'Finalizado');
              
              return (
                <button
                  key={tableNumber}
                  onClick={() => setSelectedTable(tableNumber.toString())}
                  className={`p-3 rounded-lg ${selectedTable === tableNumber.toString() ? 'bg-indigo-100 border-2 border-indigo-500' : 'bg-gray-50'} ${hasActiveOrders ? 'ring-2 ring-red-500' : ''}`}
                >
                  Mesa {tableNumber}
                  {hasActiveOrders && (
                    <span className="ml-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                      Pedido
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Table Details */}
        <div className="flex-1 p-4">
          {selectedTable ? (
            <>
              <div className="bg-white rounded-lg shadow p-4 mb-4">
                <h2 className="text-xl font-bold mb-4">Mesa {selectedTable}</h2>
                
                {tables.find(t => t.id === selectedTable)?.orders?.length > 0 ? (
                  tables.find(t => t.id === selectedTable).orders.map((order, i) => (
                    <div key={i} className="mb-6 border-b pb-4">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-bold">Pedido #{i + 1}</h3>
                        <select
                          value={order.status}
                          onChange={(e) => updateOrderStatus(selectedTable, Object.keys(tables.find(t => t.id === selectedTable).orders)[i], e.target.value)}
                          className="bg-gray-100 p-2 rounded"
                        >
                          <option value="Recebido">Recebido</option>
                          <option value="Em preparo">Em preparo</option>
                          <option value="Pronto">Pronto</option>
                          <option value="Entregue">Entregue</option>
                          <option value="Finalizado">Finalizado</option>
                        </select>
                      </div>
                      
                      <div className="space-y-2">
                        {order.items.map((item, j) => (
                          <div key={j} className="flex justify-between">
                            <span>{item.name}</span>
                            <span>R$ {item.price.toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                      
                      <div className="flex justify-between font-bold mt-2">
                        <span>Total:</span>
                        <span>R$ {order.items.reduce((sum, item) => sum + item.price, 0).toFixed(2)}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">Nenhum pedido ativo para esta mesa.</p>
                )}
              </div>

              {/* Send Message */}
              <div className="bg-white rounded-lg shadow p-4">
                <h3 className="font-bold mb-2">Enviar Mensagem</h3>
                <div className="flex">
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Digite uma mensagem..."
                    className="flex-1 border p-2 rounded-l"
                  />
                  <button
                    onClick={() => sendMessage(selectedTable)}
                    className="bg-indigo-600 text-white px-4 rounded-r"
                  >
                    Enviar
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <p className="text-gray-500">Selecione uma mesa para visualizar os detalhes</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;