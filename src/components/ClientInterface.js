import { useState, useEffect, useCallback, useMemo } from 'react';
import { onValue, push, update, ref, set, get, remove } from 'firebase/database';
import { database } from '../firebase';
import { useWindowSize } from 'usehooks-ts'
import { debounce } from 'lodash';
import { AnimatePresence, motion } from 'framer-motion';
import { LazyLoadImage } from 'react-lazy-load-image-component';


// Import otimizado de imagens
const foodImages = {
  frangoCremoso: import('../assets/frango-cremoso.jpg'),
  picanhaPremium: import('../assets/picanha-premium.jpg'),
  costelaRaiz: import('../assets/costela-raiz.jpg'),
  feijoada: import('../assets/feijoada.jpg'),
  hamburguer: import('../assets/hamburguer.jpg'),
  batataFrita: import('../assets/batata-frita.jpg'),
  pastel: import('../assets/pastel.jpg'),
  cafe: import('../assets/cafe.jpg'),
  bebida: import('../assets/bebida.jpg'),
  salgado: import('../assets/salgado.jpg'),
  sobremesa: import('../assets/sobremesa.jpg')
};

const ClientInterface = ({ tableNumber }) => {
  const [cart, setCart] = useState([]);
  const [orderStatus, setOrderStatus] = useState('');
  const [activeCategory, setActiveCategory] = useState('semana');
  const [messages, setMessages] = useState([]);
  const [currentOrderId, setCurrentOrderId] = useState(null);
  const [isSendingOrder, setIsSendingOrder] = useState(false);
  const [showConsumptionSummary, setShowConsumptionSummary] = useState(false);
  const [consumptionItems, setConsumptionItems] = useState([]);
  const [activeOrder, setActiveOrder] = useState(null);
  const [billRequested, setBillRequested] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [loadedImages, setLoadedImages] = useState({});
  
  const windowSize = useWindowSize();

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
  const closeOrder = async () => {
    try {
      if (!currentOrderId) return;
      
      const orderRef = ref(database, `tables/${tableNumber}/currentOrder/${currentOrderId}`);
      await update(orderRef, {
        status: 'Fechado',
        closedAt: Date.now()
      });

      const orderSnapshot = await get(orderRef);
      const orderData = orderSnapshot.val();
      
      const historyRef = ref(database, `tables/${tableNumber}/ordersHistory`);
      await push(historyRef, orderData);
      
      await remove(orderRef);
      
      setOrderStatus('Comanda fechada com sucesso!');
      setCart([]);
      setCurrentOrderId(null);
      setActiveOrder(null);
      
    } catch (error) {
      console.error("Erro ao fechar comanda:", error);
      setOrderStatus('Erro ao fechar comanda');
    }
  };

  const removeItemFromOrder = async (itemId) => {
    if (!currentOrderId) return;
    
    try {
      const itemsRef = ref(database, `tables/${tableNumber}/currentOrder/${currentOrderId}/items`);
      const snapshot = await get(itemsRef);
      const currentItems = snapshot.val() || [];
      
      const updatedItems = currentItems.filter(item => item.id !== itemId);
      await set(itemsRef, updatedItems);
      
      setActiveOrder(prev => ({
        ...prev,
        items: updatedItems
      }));
      
      setCart(prevCart => prevCart.filter(item => item.id !== itemId));
      setOrderStatus('Item removido com sucesso!');
      setTimeout(() => setOrderStatus(''), 3000);
    } catch (error) {
      console.error("Erro ao remover item:", error);
      setOrderStatus('Erro ao remover item');
    }
  };

  useEffect(() => {
    const orderRef = ref(database, `tables/${tableNumber}/currentOrder`);
    const orderUnsubscribe = onValue(orderRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const order = Object.entries(data)[0];
        if (order) {
          setCurrentOrderId(order[0]);
          setActiveOrder(order[1]);
          setOrderStatus(order[1]?.status || 'Pedido recebido');
          
          if (order[1]?.status === 'Fechado') {
            setCart([]);
          }
        } else {
          setCurrentOrderId(null);
          setActiveOrder(null);
          setOrderStatus('');
        }
      } else {
        setCurrentOrderId(null);
        setActiveOrder(null);
        setOrderStatus('');
      }
    });

    const messagesRef = ref(database, `tables/${tableNumber}/messages`);
    const messagesUnsubscribe = onValue(messagesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const messagesList = Object.values(data);
        setMessages(messagesList);
      } else {
        setMessages([]);
      }
    });
  
    return () => {
      orderUnsubscribe();
      messagesUnsubscribe();
    };
  }, [tableNumber]);

  const addToCart = (item) => {
    setCart(prevCart => {
      const existingItemIndex = prevCart.findIndex(cartItem => cartItem.id === item.id);
      
      if (existingItemIndex >= 0) {
        const updatedCart = [...prevCart];
        updatedCart[existingItemIndex] = {
          ...updatedCart[existingItemIndex],
          quantity: (updatedCart[existingItemIndex].quantity || 1) + 1
        };
        return updatedCart;
      } else {
        return [...prevCart, { ...item, quantity: 1, cartId: Date.now() }];
      }
    });
  };

  const removeFromCart = (cartId, itemId) => {
    setCart(prevCart => {
      const existingItemIndex = prevCart.findIndex(item => item.cartId === cartId);
      
      if (existingItemIndex >= 0) {
        const item = prevCart[existingItemIndex];
        
        if (item.quantity > 1) {
          const updatedCart = [...prevCart];
          updatedCart[existingItemIndex] = {
            ...item,
            quantity: item.quantity - 1
          };
          return updatedCart;
        } else {
          if (activeOrder?.items?.some(i => i.id === item.id)) {
            removeItemFromOrder(item.id);
          }
          return prevCart.filter(item => item.cartId !== cartId);
        }
      }
      return prevCart;
    });
  };

  const sendOrder = async () => {
    if (cart.length === 0) return;
    
    setIsSendingOrder(true);
    try {
      const orderItems = cart.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        description: item.description || '',
        quantity: item.quantity || 1
      }));
  
      const orderData = {
        items: orderItems,
        status: 'Recebido',
        createdAt: Date.now(),
        tableNumber,
        source: 'client',
        total: calculateTotal()
      };
  
      const orderRef = currentOrderId 
        ? ref(database, `tables/${tableNumber}/currentOrder/${currentOrderId}`)
        : ref(database, `tables/${tableNumber}/currentOrder`);
  
      if (currentOrderId) {
        const existingItems = activeOrder?.items || [];
        await update(orderRef, {
          items: [...existingItems, ...orderItems],
          updatedAt: Date.now(),
          status: 'Recebido',
          total: (activeOrder?.total || 0) + calculateTotal()
        });
      } else {
        const newOrderRef = await push(orderRef, orderData);
        setCurrentOrderId(newOrderRef.key);
      }
  
      setCart([]);
      setOrderStatus('Pedido enviado com sucesso!');
      setShowCart(false);
    } catch (error) {
      setOrderStatus('Erro ao enviar pedido');
      console.error(error);
    } finally {
      setIsSendingOrder(false);
    }
  };

  const calculateTotal = () => {
    return cart.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('pt-PT', {
      style: 'currency',
      currency: 'EUR'
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 flex flex-col">
      {/* Header Premium Reformulado */}
      <header className="bg-gradient-to-b from-gray-900 to-gray-800 text-white shadow-2xl sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center py-4">
            {/* Logo e Identificação */}
            <div className="flex items-center mb-4 md:mb-0">
              <div className="bg-amber-500 p-3 rounded-xl shadow-lg mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-amber-600">
                  Alto Astral
                </h1>
                <p className="text-xs text-gray-300">Gastronomia Premium</p>
              </div>
            </div>

            {/* Info Mesa e Carrinho */}
            <div className="flex items-center space-x-6">
              {/* Badge Mesa */}
              <div className="relative group">
                <div className="bg-gray-800 rounded-full p-3 flex items-center justify-center shadow-lg border-2 border-amber-500">
                  <span className="text-xl font-bold">{tableNumber}</span>
                </div>
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-amber-500 text-white text-xs px-2 py-1 rounded-full whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  Sua Mesa
                </div>
              </div>

              {/* Botão Carrinho */}
              <button 
                onClick={() => setShowCart(!showCart)}
                className="relative p-3 bg-gray-800 rounded-full hover:bg-gray-700 transition-all duration-300 shadow-lg group"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                {cart.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center shadow-md animate-bounce">
                    {cart.reduce((sum, item) => sum + (item.quantity || 1), 0)}
                  </span>
                )}
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-amber-500 text-white text-xs px-2 py-1 rounded-full whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  Meu Pedido
                </div>
              </button>
            </div>
          </div>

          {/* Status do Pedido */}
          {orderStatus && (
            <div className="pb-4">
              <div className={`text-sm p-3 rounded-lg font-medium text-center ${
                orderStatus.includes('Erro') ? 'bg-red-500' : 'bg-amber-600'
              } shadow-md animate-pulse`}>
                {orderStatus}
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Categorias do Menu */}
      <div className="bg-white shadow-lg sticky top-0 z-10">
        <div className="container mx-auto overflow-x-auto">
          <div className="flex">
            {Object.keys(menu).map(category => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-6 py-4 whitespace-nowrap font-medium text-sm transition-all ${
                  activeCategory === category 
                    ? 'border-b-4 border-amber-500 text-amber-600 font-bold' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-amber-50'
                }`}
              >
                {category === 'semana' ? 'Cardápio' : 
                 category === 'lanches' ? 'Lanches' : 
                 category === 'porcoes' ? 'Porções' : 
                 category === 'pasteis' ? 'Pastéis' : 
                 category === 'cafe' ? 'Café' : 
                 category === 'bebidas' ? 'Bebidas' : 
                 category === 'salgados' ? 'Salgados' : 
                 'Sobremesas'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Conteúdo Principal */}
      <main className="flex-grow container mx-auto px-4 py-8 pb-32">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {menu[activeCategory].map(item => (
            <div key={item.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col h-full border border-gray-100">
              <div className="h-48 overflow-hidden relative">
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = foodImages.frangoCremoso;
                  }}
                />
                {item.veg && (
                  <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full shadow-md">
                    VEG
                  </div>
                )}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent h-16"></div>
                <div className="absolute bottom-2 left-2 text-white font-bold text-lg">{item.name}</div>
              </div>
              <div className="p-4 flex flex-col flex-grow">
                {item.description && (
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">{item.description}</p>
                )}
                <div className="mt-auto flex justify-between items-center">
                  <div>
                    <p className="text-amber-600 font-bold text-xl">{formatPrice(item.price)}</p>
                    {item.rating && (
                      <div className="flex items-center mt-1">
                        <div className="flex text-amber-400">
                          {[...Array(5)].map((_, i) => (
                            <svg key={i} xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ${i < Math.floor(item.rating) ? 'fill-current' : ''}`} viewBox="0 0 20 20" stroke="currentColor">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                        <span className="text-xs text-gray-500 ml-1">{item.rating}</span>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => addToCart(item)}
                    className="bg-gradient-to-br from-amber-500 to-amber-600 text-white p-2 rounded-full h-10 w-10 flex items-center justify-center hover:from-amber-600 hover:to-amber-700 transition-all transform hover:scale-110 shadow-md"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Carrinho de Pedidos - Modal */}
      {showCart && (
        <div className="fixed inset-0 bg-black/50 z-30 flex justify-end backdrop-blur-sm">
          <div className="bg-white w-full max-w-md h-full overflow-y-auto transform transition-transform duration-300 ease-in-out shadow-2xl">
            <div className="sticky top-0 bg-gradient-to-r from-amber-500 to-amber-600 text-white p-6 flex justify-between items-center shadow-md">
              <h2 className="text-2xl font-bold flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Seu Pedido
              </h2>
              <button 
                onClick={() => setShowCart(false)}
                className="text-white hover:text-amber-200 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {cart.length === 0 ? (
              <div className="text-center py-12">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <p className="mt-4 text-gray-500 text-lg">Seu carrinho está vazio</p>
                <button
                  onClick={() => setShowCart(false)}
                  className="mt-6 px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-lg hover:from-amber-600 hover:to-amber-700 transition-all transform hover:scale-105 shadow-lg font-bold"
                >
                  Voltar ao cardápio
                </button>
              </div>
            ) : (
              <div className="p-6">
                <div className="space-y-4 mb-8">
                  {cart.map(item => (
                    <div key={item.cartId} className="flex justify-between items-start p-4 bg-amber-50 rounded-xl border border-amber-100">
                      <div className="flex items-start flex-grow">
                        <button
                          onClick={() => removeFromCart(item.cartId, item.id)}
                          className="text-red-500 hover:text-red-700 mr-3 mt-1 transition-colors"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                        <div className="flex-grow">
                          <span className="font-bold text-gray-800">{item.name}</span>
                          <div className="flex items-center mt-2">
                            <button 
                              onClick={() => removeFromCart(item.cartId, item.id)}
                              className="text-gray-500 hover:text-amber-600 transition-colors"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                              </svg>
                            </button>
                            <span className="mx-3 text-lg font-bold">{item.quantity || 1}</span>
                            <button 
                              onClick={() => addToCart(item)}
                              className="text-gray-500 hover:text-amber-600 transition-colors"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                      <span className="font-bold text-gray-800 text-lg">{formatPrice(item.price * (item.quantity || 1))}</span>
                    </div>
                  ))}
                </div>
                
                <div className="border-t border-amber-200 pt-6 mb-8">
                  <div className="flex justify-between items-center mb-3">
                    <span className="font-bold text-gray-700 text-lg">Subtotal:</span>
                    <span className="font-bold text-gray-800 text-lg">{formatPrice(calculateTotal())}</span>
                  </div>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm text-gray-600">Taxa de serviço:</span>
                    <span className="text-sm text-gray-600">{formatPrice(0)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-bold text-gray-800">Total:</span>
                    <span className="text-2xl font-bold text-amber-600">{formatPrice(calculateTotal())}</span>
                  </div>
                </div>
                
                <button
                  onClick={sendOrder}
                  disabled={isSendingOrder}
                  className={`w-full py-4 rounded-xl font-bold transition-all transform hover:scale-105 flex items-center justify-center space-x-3 mb-6 shadow-lg ${
                    isSendingOrder 
                      ? 'bg-amber-400 cursor-not-allowed' 
                      : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white'
                  }`}
                >
                  {isSendingOrder ? (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      <span className="text-lg">Enviando...</span>
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                      <span className="text-lg">{currentOrderId ? 'Adicionar ao Pedido' : 'Enviar Pedido'}</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Rodapé Premium com Animação de Onda */}
      <footer className="relative bg-gray-900 text-white pt-20 pb-10 overflow-hidden">
        {/* Animação de Onda */}
        <div className="absolute top-0 left-0 right-0 h-20 overflow-hidden">
          <svg 
            viewBox="0 0 1200 120" 
            preserveAspectRatio="none" 
            className="absolute top-0 left-0 w-full h-full"
          >
            <path 
              d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" 
              opacity=".25" 
              className="fill-amber-500"
            ></path>
            <path 
              d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" 
              opacity=".5" 
              className="fill-amber-500"
            ></path>
            <path 
              d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" 
              className="fill-amber-600"
            ></path>
          </svg>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-8 md:mb-0 text-center md:text-left">
              <h3 className="text-2xl font-bold mb-4 flex items-center justify-center md:justify-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-2 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Alto Astral
              </h3>
              <p className="text-gray-300 mb-2">Rua Agostinho Da Silva, Lote 20, Loja 2</p>
              <p className="text-gray-300 mb-2">8500-826 Portimão, Pt – Urb. Horta De São Pedro</p>
              <p className="text-gray-300 mb-4">Telefone: 282 038 830</p>
              <p className="text-amber-400 font-medium">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Segunda a Sábado — ⏰ 8:00h às 20:00h
              </p>
            </div>
            
            <div className="flex space-x-6">
              <a href="#" className="text-gray-300 hover:text-amber-400 transition-colors">
                <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="#" className="text-gray-300 hover:text-amber-400 transition-colors">
                <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="#" className="text-gray-300 hover:text-amber-400 transition-colors">
                <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a href="#" className="text-gray-300 hover:text-amber-400 transition-colors">
                <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-gray-800 text-center">
            <p className="text-gray-400 text-sm">
              &copy; {new Date().getFullYear()} Alto Astral. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ClientInterface;