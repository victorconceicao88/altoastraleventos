import { useState, useEffect, useCallback, useMemo } from 'react';
import { onValue, push, update, ref, set, get, remove } from 'firebase/database';
import { database } from '../firebase';
import { useWindowSize } from 'usehooks-ts';
import { debounce } from 'lodash';
import { AnimatePresence, motion } from 'framer-motion';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import Footer from './footer';



// Importe todas as imagens
import frangoCremoso from '../assets/frango-cremoso.jpg';
import picanhaPremium from '../assets/picanha-premium.jpg';
import costelaRaiz from '../assets/costela-raiz.jpg';
import feijoada from '../assets/feijoada.jpg';
import hamburguer from '../assets/hamburguer.jpg';
import batataFrita from '../assets/batata-frita.jpg';
import pastel from '../assets/pastel.jpg';
import cafe from '../assets/cafe.jpg';
import bebida from '../assets/bebida.jpg';
import salgado from '../assets/salgado.jpg';
import sobremesa from '../assets/sobremesa.jpg';

// Mapeamento de imagens
const foodImages = {
  frangoCremoso,
  picanhaPremium,
  costelaRaiz,
  feijoada,
  hamburguer,
  batataFrita,
  pastel,
  cafe,
  bebida,
  salgado,
  sobremesa
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
  
  const windowSize = useWindowSize();
  
  const menu = {
    semana: [
      { id: 1, name: 'Frango Cremoso', description: 'Strogonoff de frango, arroz branco, salada e batata palha', price: 12.90, veg: false, image: 'frangoCremoso', rating: 4.5 },
      { id: 2, name: 'Picanha Premium', description: 'Picanha grelhada, arroz branco, feijão tropeiro e vinagrete', price: 15.90, veg: false, image: 'picanhaPremium', rating: 4.8 },
      { id: 3, name: 'Costela Raiz', description: 'Costela de vaca com mandioca, arroz branco, farofa e salada', price: 14.90, veg: false, image: 'costelaRaiz', rating: 4.7 },
      { id: 4, name: 'Frango Supremo', description: 'Filé de frango à parmegiana, arroz branco, batata frita e salada', price: 13.90, veg: false, image: 'frangoCremoso', rating: 4.3 },
      { id: 5, name: 'Feijoada Astral', description: 'Feijoada brasileira, arroz branco, couve, farofa, torresmo e laranja', price: 12.90, veg: false, image: 'feijoada', rating: 4.9 },
      { id: 6, name: 'Opção Vegetariana', description: 'Prato vegetariano sob consulta - acompanha bebida e café', price: 12.90, veg: true, image: 'frangoCremoso', rating: 4.2 }
    ],
    lanches: [
      { id: 7, name: 'Hambúrguer com Fritas', description: 'Carne, alface, tomate, cebola, cheddar, molho da casa', price: 7.00, image: 'hamburguer', rating: 4.4 },
      { id: 8, name: 'Hambúrguer Alto Astral', description: 'Carne 120g, bacon, queijo, anéis de cebola, alface, tomate, cheddar, molho coquetel e especial', price: 9.90, image: 'hamburguer', rating: 4.7 },
      { id: 9, name: 'Hambúrguer Neg\'s', description: 'Carne 120g, frango panado, bacon, queijo, anéis de cebola, cebola crispy, alface, tomate, cheddar, molho coquetel e especial', price: 12.90, image: 'hamburguer', rating: 4.9 },
      { id: 10, name: 'Sandes de Panado', description: 'Frango panado, alface, tomate, cebola, molho da casa', price: 5.50, image: 'hamburguer', rating: 4.1 },
      { id: 11, name: 'Tostas Premium', description: 'Frango ou atum acompanha queijo, alface, tomate e cebola roxa', price: 6.50, image: 'hamburguer', rating: 4.0 },
      { id: 12, name: 'Sandes Natural', description: 'Patê de frango, queijo, rúcula, tomate, cebola roxa e cenoura ralada', price: 6.50, image: 'hamburguer', rating: 3.9 }
    ],
    porcoes: [
      { id: 13, name: 'Batata Frita', description: 'Porção com 400g de batata frita', price: 4.00, image: 'batataFrita', rating: 4.2 },
      { id: 14, name: 'Fritas com Bacon e Queijo', description: 'Porção com 400g de batatas com bacon e queijo cheddar', price: 6.50, image: 'batataFrita', rating: 4.6 },
      { id: 15, name: 'Chouriça com Cebola', description: 'Porção com 600g de chouriça acebolada e pão fatiado', price: 9.00, image: 'batataFrita', rating: 4.5 },
      { id: 16, name: 'Asinha de Frango', description: 'Porção com 700g de asinhas de frango e molho barbecue', price: 12.00, image: 'batataFrita', rating: 4.4 },
      { id: 17, name: 'Costelinha', description: 'Porção com 800g de costelinha e molho barbecue', price: 12.00, image: 'batataFrita', rating: 4.7 },
      { id: 18, name: 'Picanha com Fritas', description: 'Porção com 600g de tiras de picanha temperada com sal de parrilha e acompanhado de batata frita ou doce', price: 18.00, image: 'batataFrita', rating: 4.8 },
      { id: 19, name: 'Filé de Tilápia', description: 'Porção com 800g de filé de tilápia e molho tartaro', price: 14.00, image: 'batataFrita', rating: 4.3 }
    ],
    pasteis: [
      { id: 20, name: 'Pastel Simples', description: 'Frango desfiado, carne picada ou queijo', price: 5.00, image: 'pastel', rating: 4.3 },
      { id: 21, name: 'Pastel de Frango com Queijo', description: 'Frango desfiado com queijo', price: 5.50, image: 'pastel', rating: 4.5 },
      { id: 22, name: 'Pastel de Frango com Queijo e Bacon', description: 'Frango desfiado com queijo e bacon em cubos', price: 6.50, image: 'pastel', rating: 4.7 },
      { id: 23, name: 'Pastel de Carne com Queijo', description: 'Carne picada com queijo e azeitona', price: 5.50, image: 'pastel', rating: 4.4 },
      { id: 24, name: 'Pastel de Carne com Queijo e Bacon', description: 'Carne picada com queijo, azeitona e bacon em cubos', price: 6.50, image: 'pastel', rating: 4.6 },
      { id: 25, name: 'Pastel de Chouriça', description: 'Queijo, chouriça e milho', price: 5.50, image: 'pastel', rating: 4.2 },
      { id: 26, name: 'Pastel Misto', description: 'Fiambre, queijo, azeitona e milho', price: 5.50, image: 'pastel', rating: 4.1 },
      { id: 27, name: 'Pastel de Pizza', description: 'Queijo, fiambre, tomate e orégano', price: 5.50, image: 'pastel', rating: 4.0 },
      { id: 28, name: 'Pastel Alto Astral', description: 'Queijo, bacon, tomate, azeitona, cheddar e orégano', price: 6.50, image: 'pastel', rating: 4.8 },
      { id: 29, name: 'Pastel Romeu e Julieta', description: 'Queijo com goiabada', price: 5.50, image: 'pastel', rating: 4.7 },
      { id: 30, name: 'Pastel de Banana com Nutela', description: 'Queijo, banana e nutella', price: 6.00, image: 'pastel', rating: 4.9 }
    ],
    cafe: [
      { id: 31, name: 'Café Expresso', price: 1.00, image: 'cafe', rating: 4.5 },
      { id: 32, name: 'Café Descafeinado', price: 1.00, image: 'cafe', rating: 4.3 },
      { id: 33, name: 'Café Duplo', price: 2.00, image: 'cafe', rating: 4.6 },
      { id: 34, name: 'Garoto', price: 1.00, image: 'cafe', rating: 4.2 },
      { id: 35, name: 'Abatanado', price: 1.10, image: 'cafe', rating: 4.1 },
      { id: 36, name: 'Meia de Leite', price: 1.50, image: 'cafe', rating: 4.4 },
      { id: 37, name: 'Galão', price: 1.60, image: 'cafe', rating: 4.5 },
      { id: 38, name: 'Chá', price: 1.60, image: 'cafe', rating: 4.0 },
      { id: 39, name: 'Cappuccino', price: 3.00, image: 'cafe', rating: 4.7 },
      { id: 40, name: 'Caricoa de Limão', price: 1.00, image: 'cafe', rating: 3.9 },
      { id: 41, name: 'Chocolate Quente', price: 3.00, image: 'cafe', rating: 4.8 },
      { id: 42, name: 'Torrada com Pão Caseiro', price: 2.00, image: 'cafe', rating: 4.3 },
      { id: 43, name: 'Torrada com Pão de Forma', price: 1.50, image: 'cafe', rating: 4.1 },
      { id: 44, name: 'Meia Torrada', price: 1.00, image: 'cafe', rating: 4.0 },
      { id: 45, name: 'Croissant Misto', price: 3.00, image: 'cafe', rating: 4.6 },
      { id: 46, name: 'Croissant Misto Tostado', price: 3.20, image: 'cafe', rating: 4.7 },
      { id: 47, name: 'Tosta Mista', price: 3.20, image: 'cafe', rating: 4.5 },
      { id: 48, name: 'Tosta Mista (Pão de Forma)', price: 2.80, image: 'cafe', rating: 4.4 },
      { id: 49, name: 'Sandes Mista', price: 2.20, image: 'cafe', rating: 4.2 },
      { id: 50, name: 'Pão com Ovo', price: 2.20, image: 'cafe', rating: 4.1 },
      { id: 51, name: 'Ovos com Bacon', price: 4.00, image: 'cafe', rating: 4.7 }
    ],
    bebidas: [
      { id: 52, name: 'Caipirinha', description: 'Cachaça 51 ou Velho Barreiro, lima, açúcar e gelo', price: 6.00, image: 'bebida', rating: 4.8 },
      { id: 53, name: 'Caipiblack', description: 'Cachaça preta, lima, açúcar e gelo', price: 6.00, image: 'bebida', rating: 4.9 },
      { id: 54, name: 'Whiskey Jamenson', price: 3.50, image: 'bebida', rating: 4.7 },
      { id: 55, name: 'Whiskey J&B', price: 3.00, image: 'bebida', rating: 4.5 },
      { id: 56, name: 'Whiskey Jack Daniels', price: 3.50, image: 'bebida', rating: 4.8 },
      { id: 57, name: 'Whiskey Black Label', price: 4.00, image: 'bebida', rating: 4.9 },
      { id: 58, name: 'Vodka', price: 4.00, image: 'bebida', rating: 4.6 },
      { id: 59, name: 'Somersby', price: 2.50, image: 'bebida', rating: 4.4 },
      { id: 60, name: 'Imperial Heineken (0.20)', price: 1.50, image: 'bebida', rating: 4.5 },
      { id: 61, name: 'Caneca Heineken (0.50)', price: 3.00, image: 'bebida', rating: 4.7 },
      { id: 62, name: 'Cerveja Garrafa (0.33ml)', price: 1.40, image: 'bebida', rating: 4.3 },
      { id: 63, name: 'Cerveja Mini (0.20ml)', price: 1.10, image: 'bebida', rating: 4.2 },
      { id: 64, name: 'Taça de Sangria', description: 'Sangria branca, rosé ou tinta', price: 6.00, image: 'bebida', rating: 4.8 },
      { id: 65, name: 'Refrigerante Lata', price: 1.60, image: 'bebida', rating: 4.1 },
      { id: 66, name: 'Água 1.5L', price: 1.50, image: 'bebida', rating: 4.0 },
      { id: 67, name: 'Água 0.5L', price: 1.00, image: 'bebida', rating: 4.0 },
      { id: 68, name: 'Água 0.33L', price: 0.60, image: 'bebida', rating: 4.0 },
      { id: 69, name: 'Água Castelo', price: 1.40, image: 'bebida', rating: 4.2 },
      { id: 70, name: 'Água das Pedras', price: 1.40, image: 'bebida', rating: 4.3 }
    ],
    salgados: [
      { id: 71, name: 'Pão de Queijo', price: 1.60, image: 'salgado', rating: 4.5 },
      { id: 72, name: 'Pastel de Nata', price: 1.30, image: 'salgado', rating: 4.7 },
      { id: 73, name: 'Empada de Frango', price: 2.00, image: 'salgado', rating: 4.4 },
      { id: 74, name: 'Kibe', price: 2.20, image: 'salgado', rating: 4.3 },
      { id: 75, name: 'Fiambre e Queijo', price: 2.20, image: 'salgado', rating: 4.2 },
      { id: 76, name: 'Bauru', price: 2.20, image: 'salgado', rating: 4.1 },
      { id: 77, name: 'Bola de Queijo', price: 2.20, image: 'salgado', rating: 4.3 },
      { id: 78, name: 'Coxinha de Frango', price: 2.20, image: 'salgado', rating: 4.6 },
      { id: 79, name: 'Coxinha com Catupiry', price: 3.00, image: 'salgado', rating: 4.8 },
      { id: 80, name: 'Hamburgão', price: 3.50, image: 'salgado', rating: 4.7 }
    ],
    sobremesas: [
      { id: 81, name: 'Bolo no Pote - Prestígio', description: 'Chocolate com coco', price: 4.00, image: 'sobremesa', rating: 4.8 },
      { id: 82, name: 'Bolo no Pote - Chocolate', description: 'Massa de chocolate com recheio de chocolate', price: 4.00, image: 'sobremesa', rating: 4.9 },
      { id: 83, name: 'Bolo no Pote - Ananás', description: 'Creme de ninho com pedaços de ananás', price: 4.00, image: 'sobremesa', rating: 4.7 },
      { id: 84, name: 'Bolo no Pote - Choco Misto', description: 'Chocolate preto com ninho', price: 4.00, image: 'sobremesa', rating: 4.8 },
      { id: 85, name: 'Cheesecake - Goiabada', price: 3.50, image: 'sobremesa', rating: 4.7 },
      { id: 86, name: 'Cheesecake - Frutos Vermelhos', price: 3.50, image: 'sobremesa', rating: 4.8 },
      { id: 87, name: 'Brigadeiro Tradicional', price: 1.50, image: 'sobremesa', rating: 4.6 },
      { id: 88, name: 'Brigadeiro Beijinho', price: 1.50, image: 'sobremesa', rating: 4.5 },
      { id: 89, name: 'Brigadeiro Ninho', price: 2.00, image: 'sobremesa', rating: 4.8 },
      { id: 90, name: 'Brigadeiro Paçoca', price: 2.00, image: 'sobremesa', rating: 4.7 },
      { id: 91, name: 'Brigadeiro Morango', price: 2.00, image: 'sobremesa', rating: 4.8 },
      { id: 92, name: 'Brigadeiro Churros', price: 2.00, image: 'sobremesa', rating: 4.9 },
      { id: 93, name: 'Tarte de Toblerone', price: 2.20, image: 'sobremesa', rating: 4.7 },
      { id: 94, name: 'Bolo de Brigadeiro (fatia)', price: 2.20, image: 'sobremesa', rating: 4.8 }
    ]
  };

    // Detectar mobile
    useEffect(() => {
      const handleResize = () => setIsMobile(window.innerWidth < 768);
      handleResize();
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }, []);
  
    // Adicionar ao carrinho
    const addToCart = (item) => {
      setCart(prevCart => {
        const existingItem = prevCart.find(cartItem => cartItem.id === item.id);
        if (existingItem) {
          return prevCart.map(cartItem =>
            cartItem.id === item.id 
              ? { ...cartItem, quantity: (cartItem.quantity || 1) + 1 } 
              : cartItem
          );
        } else {
          return [...prevCart, { ...item, quantity: 1, cartId: Date.now() }];
        }
      });
      if (isMobile) setShowCart(true);
    };
  
    // Remover do carrinho
    const removeFromCart = (cartId, itemId) => {
      setCart(prevCart => {
        const item = prevCart.find(item => item.cartId === cartId);
        if (item.quantity > 1) {
          return prevCart.map(cartItem =>
            cartItem.cartId === cartId 
              ? { ...cartItem, quantity: cartItem.quantity - 1 } 
              : cartItem
          );
        } else {
          if (activeOrder?.items?.some(i => i.id === itemId)) {
            removeItemFromOrder(itemId);
          }
          return prevCart.filter(item => item.cartId !== cartId);
        }
      });
    };
  
    // Remover do Firebase
    const removeItemFromOrder = async (itemId) => {
      if (!currentOrderId) return;
      try {
        const itemsRef = ref(database, `tables/${tableNumber}/currentOrder/${currentOrderId}/items`);
        const snapshot = await get(itemsRef);
        const currentItems = snapshot.val() || [];
        const updatedItems = currentItems.filter(item => item.id !== itemId);
        await set(itemsRef, updatedItems);
        setActiveOrder(prev => ({ ...prev, items: updatedItems }));
        setCart(prevCart => prevCart.filter(item => item.id !== itemId));
        setOrderStatus('Item removido');
        setTimeout(() => setOrderStatus(''), 2000);
      } catch (error) {
        console.error("Erro ao remover item:", error);
        setOrderStatus('Erro ao remover');
        setTimeout(() => setOrderStatus(''), 2000);
      }
    };
  
    // Enviar pedido
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
          status: 'Preparando',
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
            status: 'Preparando',
            total: (activeOrder?.total || 0) + calculateTotal()
          });
        } else {
          const newOrderRef = await push(orderRef, orderData);
          setCurrentOrderId(newOrderRef.key);
        }
  
        setCart([]);
        setOrderStatus('Pedido enviado');
        if (isMobile) setShowCart(false);
        setTimeout(() => setOrderStatus(''), 2000);
      } catch (error) {
        setOrderStatus('Erro ao enviar');
        setTimeout(() => setOrderStatus(''), 2000);
        console.error(error);
      } finally {
        setIsSendingOrder(false);
      }
    };
  
    // Calcular total
    const calculateTotal = () => cart.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
  
    // Formatar preço
    const formatPrice = (price) => new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(price);
  
    // Monitorar pedidos ativos
    useEffect(() => {
      const orderRef = ref(database, `tables/${tableNumber}/currentOrder`);
      const orderUnsubscribe = onValue(orderRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const order = Object.entries(data)[0];
          if (order) {
            setCurrentOrderId(order[0]);
            setActiveOrder(order[1]);
            setOrderStatus(order[1]?.status || '');
            if (order[1]?.status === 'Fechado') setCart([]);
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
  
      return () => orderUnsubscribe();
    }, [tableNumber]);
  
    return (
      <div className="min-h-screen bg-gray-50 text-gray-800 flex flex-col">
        {/* Header */}
        <header className="bg-gradient-to-b from-amber-800 to-amber-700 text-white shadow-lg sticky top-0 z-50 pt-safe-top">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center">
                <div className="bg-white p-2 rounded-lg mr-3 shadow-md">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-amber-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-2xl font-bold">Alto Astral</h1>
                  <p className="text-sm text-amber-100">Gastronomia Premium</p>
                </div>
              </div>
  
              {/* Botão do Carrinho */}
              <button 
                onClick={() => setShowCart(!showCart)}
                className="relative p-2 bg-white/20 rounded-full shadow-md flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                {cart.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {cart.reduce((sum, item) => sum + (item.quantity || 1), 0)}
                  </span>
                )}
                {!isMobile && (
                  <span className="ml-2 hidden md:inline-block">
                    {formatPrice(calculateTotal())}
                  </span>
                )}
              </button>
            </div>
  
            {/* Status do Pedido - Versão simplificada */}
            {orderStatus && (
              <div className="pb-3">
                <div className={`text-sm p-2 rounded font-medium text-center ${
                  orderStatus.includes('Erro') ? 'bg-red-500' : 'bg-amber-600'
                }`}>
                  {orderStatus}
                </div>
              </div>
            )}
          </div>
        </header>
  
        {/* Conteúdo Principal */}
        <div className="flex-grow container mx-auto px-4 py-6">
          {/* Categorias */}
          <div className="mb-6 overflow-x-auto scrollbar-hide">
            <div className="flex space-x-2">
              {Object.keys(menu).map(category => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-4 py-2 rounded-full whitespace-nowrap font-medium text-sm transition-all ${
                    activeCategory === category 
                      ? 'bg-amber-600 text-white shadow-md' 
                      : 'bg-white text-gray-700 hover:bg-amber-50'
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
  
          {/* Lista de Produtos - Ajustado para desktop */}
          <div className={`grid gap-4 pb-6 ${
            isMobile ? 'grid-cols-1' : 'grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
          }`}>
            {menu[activeCategory].map(item => (
              <motion.div 
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 flex flex-col h-full border border-gray-100"
              >
                <div className={`overflow-hidden relative ${
                  isMobile ? 'h-48' : 'h-40'
                }`}>
                  <LazyLoadImage
                    src={foodImages[item.image]}
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    effect="blur"
                    width="100%"
                    height="100%"
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
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{item.description}</p>
                  )}
                  <div className="mt-auto flex justify-between items-center">
                    <div>
                      <p className="text-amber-600 font-bold text-lg">{formatPrice(item.price)}</p>
                      {item.rating && (
                        <div className="flex items-center mt-1">
                          <div className="flex text-amber-400">
                            {[...Array(5)].map((_, i) => (
                              <svg key={i} xmlns="http://www.w3.org/2000/svg" className={`h-3 w-3 ${i < Math.floor(item.rating) ? 'fill-current' : ''}`} viewBox="0 0 20 20" stroke="currentColor">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                          <span className="text-xs text-gray-500 ml-1">{item.rating}</span>
                        </div>
                      )}
                    </div>
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={() => addToCart(item)}
                      className="bg-gradient-to-br from-amber-500 to-amber-600 text-white p-2 rounded-full h-9 w-9 flex items-center justify-center hover:from-amber-600 hover:to-amber-700 transition-all transform hover:scale-110 shadow-md"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
  
        {/* Carrinho - Versão Mobile */}
        <AnimatePresence>
          {isMobile && showCart && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
              onClick={() => setShowCart(false)}
            >
              <motion.div 
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 30 }}
                className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl max-h-[80vh] overflow-hidden flex flex-col"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="bg-amber-600 text-white p-4 flex justify-between items-center">
                  <h2 className="text-xl font-bold flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    Seu Pedido
                  </h2>
                  <button 
                    onClick={() => setShowCart(false)}
                    className="text-white hover:text-amber-200"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
  
                <div className="flex-grow overflow-y-auto p-4">
                  {cart.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      <p>Seu carrinho está vazio</p>
                      <button
                        onClick={() => setShowCart(false)}
                        className="mt-4 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 shadow-md"
                      >
                        Voltar ao cardápio
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="space-y-3 mb-6">
                        {cart.map(item => (
                          <motion.div 
                            key={item.cartId}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex justify-between items-start p-3 bg-amber-50 rounded-lg shadow-sm"
                          >
                            <div className="flex-grow">
                              <div className="font-medium text-gray-800">{item.name}</div>
                              <div className="flex items-center mt-2">
                                <button 
                                  onClick={() => removeFromCart(item.cartId, item.id)}
                                  className="text-gray-500 hover:text-amber-600"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                                  </svg>
                                </button>
                                <span className="mx-2 font-medium">{item.quantity || 1}</span>
                                <button 
                                  onClick={() => addToCart(item)}
                                  className="text-gray-500 hover:text-amber-600"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                  </svg>
                                </button>
                              </div>
                            </div>
                            <div className="font-bold text-gray-800">
                              {formatPrice(item.price * (item.quantity || 1))}
                            </div>
                          </motion.div>
                        ))}
                      </div>
  
                      <div className="bg-white p-4 rounded-lg border border-gray-200 mb-6 shadow-sm">
                        <div className="flex justify-between mb-2">
                          <span className="text-gray-700">Subtotal:</span>
                          <span className="font-medium">{formatPrice(calculateTotal())}</span>
                        </div>
                        <div className="border-t border-gray-200 my-2"></div>
                        <div className="flex justify-between items-center">
                          <span className="text-lg font-bold text-gray-800">Total:</span>
                          <span className="text-xl font-bold text-amber-600">{formatPrice(calculateTotal())}</span>
                        </div>
                      </div>
  
                      <button
                        onClick={sendOrder}
                        disabled={isSendingOrder || cart.length === 0}
                        className={`w-full py-3 rounded-lg font-bold transition-all shadow-lg mb-4 ${
                          isSendingOrder || cart.length === 0
                            ? 'bg-gray-300 cursor-not-allowed'
                            : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white'
                        }`}
                      >
                        {isSendingOrder ? (
                          <span className="flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 animate-spin mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            Enviando...
                          </span>
                        ) : (
                          <span className="flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                            </svg>
                            Enviar Pedido
                          </span>
                        )}
                      </button>
                    </>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
  
        {/* Carrinho - Versão Desktop */}
        <AnimatePresence>
          {!isMobile && showCart && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
              onClick={() => setShowCart(false)}
            >
              <motion.div 
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 30 }}
                className="absolute top-0 right-0 h-full bg-white shadow-2xl w-full max-w-md overflow-hidden flex flex-col"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="bg-amber-600 text-white p-4 flex justify-between items-center">
                  <h2 className="text-xl font-bold flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    Seu Pedido
                  </h2>
                  <button 
                    onClick={() => setShowCart(false)}
                    className="text-white hover:text-amber-200"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
  
                <div className="flex-grow overflow-y-auto p-4">
                  {cart.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      <p>Seu carrinho está vazio</p>
                      <button
                        onClick={() => setShowCart(false)}
                        className="mt-4 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 shadow-md"
                      >
                        Voltar ao cardápio
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="space-y-3 mb-6">
                        {cart.map(item => (
                          <motion.div 
                            key={item.cartId}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex justify-between items-start p-3 bg-amber-50 rounded-lg shadow-sm"
                          >
                            <div className="flex-grow">
                              <div className="font-medium text-gray-800">{item.name}</div>
                              {item.description && (
                                <div className="text-xs text-gray-500 mt-1 line-clamp-1">{item.description}</div>
                              )}
                              <div className="flex items-center mt-2">
                                <button 
                                  onClick={() => removeFromCart(item.cartId, item.id)}
                                  className="text-gray-500 hover:text-amber-600"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                                  </svg>
                                </button>
                                <span className="mx-2 font-medium">{item.quantity || 1}</span>
                                <button 
                                  onClick={() => addToCart(item)}
                                  className="text-gray-500 hover:text-amber-600"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                  </svg>
                                </button>
                              </div>
                            </div>
                            <div className="font-bold text-gray-800">
                              {formatPrice(item.price * (item.quantity || 1))}
                            </div>
                          </motion.div>
                        ))}
                      </div>
  
                      <div className="bg-white p-4 rounded-lg border border-gray-200 mb-6 shadow-sm">
                        <div className="flex justify-between mb-2">
                          <span className="text-gray-700">Subtotal:</span>
                          <span className="font-medium">{formatPrice(calculateTotal())}</span>
                        </div>
                        <div className="border-t border-gray-200 my-2"></div>
                        <div className="flex justify-between items-center">
                          <span className="text-lg font-bold text-gray-800">Total:</span>
                          <span className="text-xl font-bold text-amber-600">{formatPrice(calculateTotal())}</span>
                        </div>
                      </div>
  
                      <button
                        onClick={sendOrder}
                        disabled={isSendingOrder || cart.length === 0}
                        className={`w-full py-3 rounded-lg font-bold transition-all shadow-lg mb-4 ${
                          isSendingOrder || cart.length === 0
                            ? 'bg-gray-300 cursor-not-allowed'
                            : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white'
                        }`}
                      >
                        {isSendingOrder ? (
                          <span className="flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 animate-spin mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            Enviando...
                          </span>
                        ) : (
                          <span className="flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                            </svg>
                            Enviar Pedido
                          </span>
                        )}
                      </button>
                    </>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
        <Footer/>
      </div>
    );
  };
  
  export default ClientInterface;