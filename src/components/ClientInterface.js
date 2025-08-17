import { useState, useEffect, useCallback, useRef } from 'react';
import { onValue, push, update, ref, set, get, remove,child } from 'firebase/database';
import { database } from '../firebase';
import { useWindowSize } from 'usehooks-ts';
import { AnimatePresence, motion } from 'framer-motion';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import { 
  FaShoppingCart, 
  FaPlus, 
  FaMinus, 
  FaTrash, 
  FaCheck, 
  FaUtensils, 
  FaReceipt,
  FaCartPlus,
  FaBeer,
  FaBirthdayCake,
  FaCoffee,
  FaHamburger,
  FaBreadSlice,
  FaWineBottle,
  FaIceCream,
  FaHeart,
  FaSnowflake,
  FaClock,
  FaCheckCircle
} from 'react-icons/fa';
import { GiMeal, GiCupcake, GiHamburger, GiFruitBowl, GiWaterBottle } from 'react-icons/gi';
import { BiDrink } from 'react-icons/bi';
import { IoMdClose } from 'react-icons/io';
import { Link } from 'react-router-dom';
import {
  FiMapPin, FiPhone, FiClock, FiLock, FiMail, FiCalendar, FiInstagram, FiFacebook, FiArrowRight, FiCheck,
  FiShoppingBag, FiPlus
} from 'react-icons/fi';

// Importe todas as imagens
import frangoCremoso from '../assets/frango-cremoso.jpg';
import picanha from '../assets/picanha.jpg';
import costelaRaiz from '../assets/costela-raiz.jpg';
import frangoSupremo from '../assets/frangosupremo.jpg';
import feijoadaAstral from '../assets/feijoada.jpg';
import hamburguer from '../assets/hamburguer.jpg';
import chorica from '../assets/choriça.jpg';
import Asinha from '../assets/Asinha.jpg';
import Picanhacomfritas from '../assets/picanha-com-fritas.jpg';
import Filetilapia from '../assets/filetilapia.jpg';
import baldedecerveja from '../assets/baldecerveja.jpeg';
import vegano from '../assets/vegano.jpg';
import hamburgueraltoastral from '../assets/hamburgueraltoastral.jpg';
import sandespanado from '../assets/sandespanado.jpg';
import negs from '../assets/negs.jpg';
import fritascomqueijo from '../assets/fritascomqueijo.jpg';
import costelaporco from '../assets/costelaporco.jpg';
import pastelfeira from '../assets/pastelfeira.jpg';
import abatanado from '../assets/abatanado.png';
import chocolatequente from '../assets/chocolatequente.jpg';
import caipirinha from '../assets/caipirinha.jpg';
import logoBackground from '../assets/fotodecapa.jpeg';
import cafe from '../assets/cafe.jpg';
import pedras from '../assets/pedras.jpg';
import Somersby from '../assets/somersby.jpg';
import Imperial from '../assets/imperial.jpg';
import cerveja from '../assets/cerveja.jpg';
import sangria from '../assets/sangria.jpg';
import refrigerantes from '../assets/refrigerantes.jpg';
import Coxinha from '../assets/coxinha.jpg';
import agua from '../assets/agua.jpg';
import kibe from '../assets/kibe.jpg';
import bauru from '../assets/bauru.jpg';
import fiambre from '../assets/fiambre.jpg';
import ovosebacon from '../assets/ovosebacon.jpg';
import tosta from '../assets/tosta.jpg';
import croissant from '../assets/croissant.jpg';
import paodequeijo from '../assets/paodequeijo.jpg';
import doces from '../assets/doces.jpg';
import sanduichenatural from '../assets/saduichenatural.jpg';
import tostaspremium from '../assets/tostaspremium.jpg';
import pasteldenata from '../assets/pastel-de-nata.jpg';
import empadafrango from '../assets/empadafrango.jpg';
import hamburgao from '../assets/hamburgao.jpg';
import meialeite from '../assets/meialeite.jpg';
import cha from '../assets/cha.jpg';
import croissanmisto from '../assets/croissantmisto.jpg';
import sandesmista from '../assets/sandesmista.jpg';
import galao from '../assets/galao.jpg';
import cariocalimao from '../assets/cariocalimao.jpg';
import paocomovo from '../assets/paocomovo.jpg';
import torradapaocaseiro from '../assets/torradapaocaseiro.jpg';
import torradapaodeforma from '../assets/torradapaodeforma.jpg';
import bolaqueijo from '../assets/bolaqueijo.jpg';
import pasteldestaque from '../assets/pasteldestaque.jpg';
import tostamistapaoforma from '../assets/tostamistapaoforma.jpg';
import Garoto from '../assets/garoto.jpg';
import vodka from '../assets/vodka.jpg';
import Caipiblack from '../assets/caipiblack.jpg';
import fiambreequeijo from '../assets/fiambreequeijo.jpg';
import capuccino from '../assets/capuccino.jpg';
import Castelo from '../assets/castelo.jpg';
import Cheesecake from '../assets/cheesecake.jpg';
import maracuja from '../assets/Maracuja.jpg';
import acerola from '../assets/Acerola.jpg';
import manga from '../assets/manga.jpg';
import goiaba from '../assets/goiaba.jpg';
import morango from '../assets/morango.jpg';
import Caju from '../assets/caju.jpg';
import abacaxi from '../assets/Abacaxi.jpg';
import coco from '../assets/coco.jpg';
import caja from '../assets/Caja.jpg';
import cupuacu from '../assets/cupucacu.jpg';
import graviola from '../assets/graviola.jpg';
import frutosvermelhos from '../assets/frutosvermelhos.jpg';
import bolopoteananas from '../assets/bolopoteananas.jpg';
import Prestígio from '../assets/presigio.jpg';
import toblerone from '../assets/toblerone.jpg';
import logo from '../assets/logo-alto-astral.png';
import EventImage1 from '../assets/eventos/evento1.jpg';
import EventImage2 from '../assets/eventos/evento2.jpg';
import EventImage3 from '../assets/eventos/evento3.jpg';
import altoastralFoto from '../assets/ondas.jpeg';
import salgadosDocesFoto from '../assets/salgados-doces.jpg';
import pedrassabor from '../assets/pedrassabor.jpg';
import superbock from '../assets/superbock.jpg';
import compal from '../assets/compal.jpg';
import energetico from '../assets/energetico.jpg';


const ClientInterface = ({ tableNumber }) => {
  const [cart, setCart] = useState([]);
  const [orderStatus, setOrderStatus] = useState('');
  const [activeCategory, setActiveCategory] = useState('semana');
  const [currentOrderId, setCurrentOrderId] = useState(null);
  const [isSendingOrder, setIsSendingOrder] = useState(false);
  const [activeOrder, setActiveOrder] = useState(null);
  const [showCart, setShowCart] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [itemNotes, setItemNotes] = useState({});
  const [showItemAdded, setShowItemAdded] = useState(false);
  const [orderNotes, setOrderNotes] = useState('');
  const [activeEvent, setActiveEvent] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [selectedBases, setSelectedBases] = useState({});
  const [isHovered, setIsHovered] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const notesInputRef = useRef(null);

  const windowSize = useWindowSize();
  const [selectedFlavors, setSelectedFlavors] = useState({});
  const [selectedJuiceFlavors, setSelectedJuiceFlavors] = useState({});
  const [selectedEnergyDrinks, setSelectedEnergyDrinks] = useState({});
  const [currentFlavor, setCurrentFlavor] = useState('');
  const [localSelectedFlavor, setLocalSelectedFlavor] = useState('');
  const [localSelectedBase, setLocalSelectedBase] = useState('agua');
  const [addingItemId, setAddingItemId] = useState(null);
  

  
  
  const events = [
    {
      id: 1,
      title: "Ambiente Acolhedor para Eventos",
      description:
        "Oferecemos um serviço completo para tornar seu evento ainda mais especial. Nosso buffet conta com um espaço acolhedor, bem estruturado e preparado para receber festas, eventos corporativos e confraternizações com conforto e elegância.",
      image: EventImage1,
      features: [
        "Espaço versátil para eventos",
        "Ambiente climatizado e organizado",
        "Ideal para confraternizações e celebrações",
        "Equipe pronta para atender"
      ]
    },
    {
      id: 2,
      title: "Gastronomia Variada e de Qualidade",
      description:
        "Trabalhamos com uma ampla variedade de salgadinhos, docinhos e petiscos preparados com ingredientes selecionados. Nossas opções são pensadas para agradar todos os paladares, oferecendo sabor, qualidade e apresentação impecável.",
      image: EventImage2,
      features: [
        "Salgados e doces artesanais",
        "Petiscos variados e saborosos",
        "Apresentação impecável",
        "Qualidade garantida"
      ]
    },
    {
      id: 3,
      title: "Atendimento e Experiência Personalizada",
      description:
        "Nosso atendimento é totalmente personalizado, com foco em praticidade e atenção aos detalhes. Buscamos proporcionar uma experiência inesquecível aos nossos clientes, cuidando de cada momento com dedicação.",
      image: EventImage3,
      features: [
        "Equipe atenciosa e dedicada",
        "Organização do início ao fim",
        "Foco na satisfação do cliente",
        "Experiência marcante para todos"
      ]
    }
  ];

  // Detectar mobile
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Mostrar mensagem de item adicionado
  useEffect(() => {
    if (showItemAdded) {
      const timer = setTimeout(() => setShowItemAdded(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [showItemAdded]);

  // Rotação automática de eventos
  useEffect(() => {
    if (!isHovering) {
      const interval = setInterval(() => {
        setActiveEvent((prev) => (prev + 1) % events.length);
      }, 8000);
      return () => clearInterval(interval);
    }
  }, [isHovering, events.length]);

  const checkAvailability = (itemId) => {
  return itemId === 6 || itemId === dailySpecialId;
};

  // Adicionar ao carrinho
const addToCart = (item, base = null) => {
  const notes = itemNotes[item.id] || '';
  let finalItem = { ...item };
  let finalPrice = item.price;
  
  if (base && item.baseOptions) {
    finalPrice = item.baseOptions[base];
    finalItem = {
      ...item,
      price: finalPrice,
      notes: `Base: ${base === 'agua' ? 'Água' : 'Leite'}${notes ? ` | ${notes}` : ''}`
    };
  }
  
  // Correção para energéticos - criar item único por marca selecionada
if (item.options) {
  const selectedOption = item.options.find(opt => 
    opt.name === selectedEnergyDrinks[item.id]
  );
  
  if (!selectedOption) return;
  
  finalItem = {
    ...item,
    name: selectedOption.name, // Armazena apenas o nome da marca
    originalName: item.name, // Guarda o nome original separadamente
    price: selectedOption.price,
    notes: notes || undefined,
    cartId: `${item.id}-${selectedOption.name}`
  };
}
  
  setCart(prevCart => {
    const existingItem = prevCart.find(cartItem => 
      item.options 
        ? cartItem.cartId === finalItem.cartId // Para energéticos, compara pelo ID único com marca
        : cartItem.id === finalItem.id && cartItem.notes === (finalItem.notes || notes)
    );
    
    if (existingItem) {
      return prevCart.map(cartItem =>
        (item.options ? cartItem.cartId === finalItem.cartId : cartItem.id === finalItem.id && cartItem.notes === (finalItem.notes || notes))
          ? { ...cartItem, quantity: (cartItem.quantity || 1) + 1 } 
          : cartItem
      );
    } else {
      return [...prevCart, { 
        ...finalItem, 
        quantity: 1, 
        cartId: item.options ? finalItem.cartId : Date.now(), // Mantém ID único para energéticos
        notes: finalItem.notes || notes
      }];
    }
  });
  
  setItemNotes(prev => ({ ...prev, [item.id]: '' }));
  setShowItemAdded(true);
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

  // Remover item completamente do carrinho
  const removeItemCompletely = (cartId) => {
    setCart(prevCart => prevCart.filter(item => item.cartId !== cartId));
  };
  

    // Função para verificar se os pastéis estão disponíveis
  const isPastelAvailable = () => {
    const now = new Date();
    const day = now.getDay(); // 0 = Domingo, 1 = Segunda, ..., 6 = Sábado
    const hours = now.getHours();
    

    if (day === 0) return false; // Domingo
    if (day === 6) return true; // Sábado
    return hours >= 15; // Segunda a Sexta após 15h
  };

  // Adicione isto com as outras funções utilitárias
const isItemAvailable = (itemId) => {
  // 6 é o ID do item vegetariano que sempre deve estar disponível
  return itemId === 6 || itemId === dailySpecialId;
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
  setOrderStatus('Enviando...');

  try {
    // Sanitização segura para mobile
    const orderItems = cart.map(item => ({
      id: String(item.id || ''),
      name: String(item.name || 'Item sem nome'),
      price: parseFloat(item.price) || 0,
      quantity: parseInt(item.quantity) || 1,
      notes: String(item.notes || ''),
      addedAt: Date.now(),
      ...(item.description && { description: String(item.description) }),
      ...(item.image && { image: String(item.image) }),
      ...(item.veg && { veg: Boolean(item.veg) }),
      ...(item.flavor && { flavor: String(item.flavor) }),
      ...(item.originalName && { originalName: String(item.originalName) })
    }));

    const orderTotal = orderItems.reduce(
      (sum, item) => sum + (parseFloat(item.price) * parseInt(item.quantity)),
      0
    );

    const orderData = {
      items: orderItems,
      status: 'Recebido',
      createdAt: Date.now(),
      tableNumber: parseInt(tableNumber) || 0,
      source: 'client',
      total: parseFloat(orderTotal.toFixed(2)),
      notes: String(orderNotes || ''),
      clientNotes: String(orderNotes || ''),
      updatedAt: Date.now()
    };

    // Lógica de envio universal para mobile/desktop
    const ordersRef = ref(database, `tables/${tableNumber}/currentOrder`);
    
    if (currentOrderId && activeOrder?.items) {
      // Atualização otimizada para mobile
      await update(ref(database, `tables/${tableNumber}/currentOrder/${currentOrderId}`), {
        items: [...activeOrder.items, ...orderItems],
        total: (parseFloat(activeOrder.total) || 0) + orderTotal,
        updatedAt: Date.now(),
        status: 'Recebido'
      });
    } else {
      // Novo pedido com fallback seguro
      const newOrderRef = push(ordersRef);
      await set(newOrderRef, orderData);
      setCurrentOrderId(newOrderRef.key);
    }

    // Reset seguro do estado
    setCart([]);
    setOrderStatus('Pedido Recebido!');
    setShowConfirmation(false);
    setOrderNotes('');
    
  } catch (error) {
    console.error("Mobile Error:", error);
    setOrderStatus('Erro: Toque para tentar novamente');
    // Tentativa automática após 5 segundos
    setTimeout(() => cart.length > 0 && sendOrder(), 5000);
  } finally {
    setIsSendingOrder(false);
    if (isMobile) setTimeout(() => setShowCart(false), 2000);
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
          if (order[1]?.status === 'Fechado') setCart([]);
        } else {
          setCurrentOrderId(null);
          setActiveOrder(null);
        }
      } else {
        setCurrentOrderId(null);
        setActiveOrder(null);
      }
    });

    return () => orderUnsubscribe();
  }, [tableNumber]);

  // Atualizar notas do item
  const updateItemNotes = (itemId, notes) => {
    setItemNotes(prev => ({ ...prev, [itemId]: notes }));
  };

  // Obter ícone da categoria
  const getCategoryIcon = (category) => {
    switch(category) {
      case 'semana':
        return <GiMeal className="h-5 w-5 mr-2" />;
      case 'lanches':
        return <FaHamburger className="h-5 w-5 mr-2" />;
      case 'porcoes':
        return <FaBreadSlice className="h-5 w-5 mr-2" />;
      case 'pasteis':
        return <GiHamburger  className="h-5 w-5 mr-2" />;
      case 'cafe':
        return <FaCoffee className="h-5 w-5 mr-2" />;
      case 'bebidas':
        return <FaBeer className="h-5 w-5 mr-2" />;
      case 'refrigerantes-aguas':
        return <GiWaterBottle className="h-5 w-5 mr-2" />;
      case 'salgados':
        return <FaUtensils className="h-5 w-5 mr-2" />;
      case 'sobremesas':
        return <FaIceCream className="h-5 w-5 mr-2" />;
      case 'sumos':
        return <GiFruitBowl className="h-5 w-5 mr-2" />;
      default:
        return <FaUtensils className="h-5 w-5 mr-2" />;
    }
  };

  const toggleFavorite = (itemId) => {
    setFavorites(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId) 
        : [...prev, itemId]
    );
  };

  const filteredMenu = (category) => {
    return menu[category] || [];
  };

  const isLoggedIn = localStorage.getItem('adminLoggedIn') === 'true';

  // Obter dia da semana (0 = Domingo, 1 = Segunda, ..., 6 = Sábado)
  const getDayOfWeek = () => {
    return new Date().getDay();
  };

  // Determinar prato do dia
  const getDailySpecial = () => {
    const day = getDayOfWeek();
    switch(day) {
      case 1: // Segunda
        return 1; // ID do Frango Cremoso
      case 2: // Terça
        return 2; // ID da Picanha Premium
      case 3: // Quarta
        return 3; // ID da Costela Raiz
      case 4: // Quinta
        return 4; // ID do Frango Supremo
      case 5: // Sexta
        return 5; // ID da Feijoada
      case 6: // Sábado
        return 6; // ID da Opção Vegetariana
      default: // Domingo e outros dias
        return null; // Nenhum prato especial
    }
  };

  const dailySpecialId = getDailySpecial();

  const foodImages = {
    frangoCremoso: frangoCremoso,
    picanhaPremium: picanha,
    costelaRaiz: costelaRaiz,
    frangosupremo: frangoSupremo,
    feijoadaAstral: feijoadaAstral,
    hamburguer: hamburguer,
    chorica: chorica,
    Asinha: Asinha,
    Picanhacomfritas: Picanhacomfritas,
    Filetilapia: Filetilapia,
    baldedecerveja: baldedecerveja,
    vegano: vegano,
    hamburgueraltoastral: hamburgueraltoastral,
    sandespanado: sandespanado,
    negs: negs,
    fritascomqueijo: fritascomqueijo,
    costelaporco: costelaporco,
    pastelfeira: pastelfeira,
    cafe: cafe,
    abatanado: abatanado,
    chocolatequente: chocolatequente,
    caipirinha: caipirinha,
    pedras:pedras,
    Somersby:Somersby,
    Imperial:Imperial,
    cerveja:cerveja,
    sangria:sangria,
    refrigerantes:refrigerantes,
    Coxinha:Coxinha,
    agua:agua,
    kibe:kibe,
    bauru:bauru,
    fiambre:fiambre,
    ovosebacaon:ovosebacon,
    tosta:tosta,
    croissant:croissant,
    paodequeijo:paodequeijo,
    doces:doces,
    sanduichenatural:sanduichenatural,
    tostaspremium:tostaspremium,
    pasteldenata:pasteldenata,
    empadafrango:empadafrango,
    hamburgao:hamburgao,
    meialeite:meialeite,
    cha:cha,
    croissanmisto:croissanmisto,
    sandesmista:sandesmista,
    galao:galao,
    cariocalimao:cariocalimao,
    paocomovo:paocomovo,
    torradapaocaseiro:torradapaocaseiro,
    torradapaodeforma:torradapaodeforma,
    bolaqueijo:bolaqueijo,
    pasteldestaque:pasteldestaque,
    tostamistapaoforma:tostamistapaoforma,
    Garoto:Garoto,
    pedras:pedras,
    vodka:vodka,
    Caipiblack:Caipiblack,
    fiambreequeijo:fiambreequeijo,
    capuccino:capuccino,
    Castelo:Castelo,
    Cheesecake:Cheesecake,
    maracuja:maracuja,
    acerola:acerola,
    manga:manga,
    goiaba:goiaba,
    morango:morango,
    Caju:Caju,
    abacaxi:abacaxi,
    coco:coco,
    caja:caja,
    cupuacu:cupuacu,
    graviola:graviola,
    frutosvermelhos:frutosvermelhos,
    bolopoteananas:bolopoteananas,
    Prestígio:Prestígio,
    toblerone:toblerone,
    pedrassabor:pedrassabor,
    superbock:superbock,
    compal:compal,
    energetico:energetico,
    batataFrita: 'https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    bebida: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    salgado: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    background: logoBackground,
  };

const menu = {
  semana: [
    { 
      id: 1, 
      name: 'Frango Cremoso', 
      description: 'Strogonoff de frango, arroz branco, salada e batata palha', 
      price: 12.90, 
      veg: false, 
      image: 'frangoCremoso', 
      rating: 4.5,
      available: true 
    },
    { 
      id: 2, 
      name: 'Maminha Top', 
      description: 'Maminha grelhada, arroz branco, feijão tropeiro e vinagrete', 
      price: 15.90, 
      veg: false, 
      image: 'picanhaPremium', 
      rating: 4.8,
      available: true 
    },
    { 
      id: 3, 
      name: 'Costela Raiz', 
      description: 'Costela de vaca com mandioca, arroz branco, farofa e salada', 
      price: 14.90, 
      veg: false, 
      image: 'costelaRaiz', 
      rating: 4.7,
      available: true 
    },
    { 
      id: 4, 
      name: 'Frango Supremo', 
      description: 'Filé de frango à parmegiana, arroz branco, batata frita e salada', 
      price: 13.90, 
      veg: false, 
      image: 'frangosupremo', 
      rating: 4.3,
      available: true 
    },
    { 
      id: 5, 
      name: 'Feijoada Astral', 
      description: 'Feijoada brasileira, arroz branco, couve, farofa, torresmo e laranja', 
      price: 12.90, 
      veg: false, 
      image: 'feijoadaAstral', 
      rating: 4.9,
      available: true 
    },
    { 
      id: 6, 
      name: 'Opção Vegetariana', 
      description: 'Prato vegetariano do dia - acompanha bebida e café', 
      price: 12.90, 
      veg: true, 
      image: 'vegano', 
      rating: 4.2,
      available: true 
    }
  ],
  lanches: [
    { 
      id: 7, 
      name: 'Hambúrguer com Fritas', 
      description: 'Carne, alface, tomate, cebola, cheddar, molho da casa', 
      price: 7.00, 
      image: 'hamburguer', 
      rating: 4.4,
      veg: false 
    },
    { 
      id: 8, 
      name: 'Hambúrguer Alto Astral', 
      description: 'Carne 120g, bacon, queijo, anéis de cebola, alface, tomate, cheddar, molho coquetel e especial', 
      price: 9.90, 
      image: 'hamburgueraltoastral', 
      rating: 4.7,
      veg: false 
    },
    { 
      id: 9, 
      name: 'Hambúrguer Neg\'s', 
      description: 'Carne 120g, frango panado, bacon, queijo, anéis de cebola, cebola crispy, alface, tomate, cheddar, molho coquetel e especial', 
      price: 12.90, 
      image: 'negs', 
      rating: 4.9,
      veg: false 
    },
    { 
      id: 10, 
      name: 'Sandes de Panado', 
      description: 'Frango panado, alface, tomate, cebola, molho da casa', 
      price: 5.50, 
      image: 'sandespanado', 
      rating: 4.1,
      veg: false 
    },
    { 
      id: 11, 
      name: 'Tostas Premium (Frango)', 
      description: 'Tosta com frango, queijo, alface, tomate e cebola roxa', 
      price: 6.50, 
      image: 'tostaspremium', 
      rating: 4.0,
      veg: false 
    },
    { 
      id: 12, 
      name: 'Tostas Premium (Atum)', 
      description: 'Tosta com atum, queijo, alface, tomate e cebola roxa', 
      price: 6.50, 
      image: 'tostaspremium', 
      rating: 4.0,
      veg: false 
    },
    { 
      id: 13, 
      name: 'Sanduíche Natural', 
      description: 'Patê de frango, queijo, rúcula, tomate, cebola roxa e cenoura ralada', 
      price: 6.50, 
      image: 'sanduichenatural', 
      rating: 3.9,
      veg: false 
    }
  ],
  porcoes: [
    { 
      id: 14, 
      name: 'Batata Frita', 
      description: 'Porção com 400g de batata frita', 
      price: 4.00, 
      image: 'batataFrita', 
      rating: 4.2,
      veg: true 
    },
    { 
      id: 15, 
      name: 'Fritas com Bacon e Queijo', 
      description: 'Porção com 400g de batatas com bacon e queijo cheddar', 
      price: 6.50, 
      image: 'fritascomqueijo', 
      rating: 4.6,
      veg: false 
    },
    { 
      id: 16, 
      name: 'Chouriça com Cebola', 
      description: 'Porção com 600g de chouriça acebolada e pão fatiado', 
      price: 9.00, 
      image: 'chorica', 
      rating: 4.5,
      veg: false 
    },
    { 
      id: 17, 
      name: 'Asinha de Frango', 
      description: 'Porção com 700g de asinhas de frango e molho barbecue', 
      price: 12.00, 
      image: 'Asinha', 
      rating: 4.4,
      veg: false 
    },
    { 
      id: 18, 
      name: 'Costelinha', 
      description: 'Porção com 800g de costelinha e molho barbecue', 
      price: 12.00, 
      image: 'costelaporco', 
      rating: 4.7,
      veg: false 
    },
    { 
      id: 19, 
      name: 'Picanha com Fritas', 
      description: 'Porção com 600g de tiras de picanha temperada com sal de parrilha e acompanhado de batata frita ou doce', 
      price: 22.90, 
      image: 'Picanhacomfritas', 
      rating: 4.8,
      veg: false 
    },
    { 
      id: 20, 
      name: 'Filé de Tilápia', 
      description: 'Porção com 800g de filé de tilápia e molho tartaro', 
      price: 15.00, 
      image: 'Filetilapia', 
      rating: 4.3,
      veg: false 
    }
  ],
  pasteis: [
    { 
      id: 21, 
      name: 'Pastel Simples', 
      description: 'Frango desfiado, carne picada ou queijo', 
      price: 5.00, 
      image: 'pastelfeira', 
      rating: 4.3,
      veg: false 
    },
    { 
      id: 22, 
      name: 'Pastel de Frango com Queijo', 
      description: 'Frango desfiado com queijo', 
      price: 5.50, 
      image: 'pastelfeira', 
      rating: 4.5,
      veg: false 
    },
    { 
      id: 23, 
      name: 'Pastel de Frango com Queijo e Bacon', 
      description: 'Frango desfiado com queijo e bacon em cubos', 
      price: 6.50, 
      image: 'pastelfeira', 
      rating: 4.7,
      veg: false 
    },
    { 
      id: 24, 
      name: 'Pastel de Carne com Queijo', 
      description: 'Carne picada com queijo e azeitona', 
      price: 5.50, 
      image: 'pastelfeira', 
      rating: 4.4,
      veg: false 
    },
    { 
      id: 25, 
      name: 'Pastel de Carne com Queijo e Bacon', 
      description: 'Carne picada com queijo, azeitona e bacon em cubos', 
      price: 6.50, 
      image: 'pastelfeira', 
      rating: 4.6,
      veg: false 
    },
    { 
      id: 26, 
      name: 'Pastel de Chouriça', 
      description: 'Queijo, chouriça e milho', 
      price: 5.50, 
      image: 'pastelfeira', 
      rating: 4.2,
      veg: false 
    },
    { 
      id: 27, 
      name: 'Pastel Misto', 
      description: 'Fiambre, queijo, azeitona e milho', 
      price: 5.50, 
      image: 'pastelfeira', 
      rating: 4.1,
      veg: false 
    },
    { 
      id: 28, 
      name: 'Pastel de Pizza', 
      description: 'Queijo, fiambre, tomate e orégano', 
      price: 5.50, 
      image: 'pastelfeira', 
      rating: 4.0,
      veg: false 
    },
    { 
      id: 29, 
      name: 'Pastel Alto Astral', 
      description: 'Queijo, bacon, tomate, azeitona, cheddar e orégano', 
      price: 6.50, 
      image: 'pastelfeira', 
      rating: 4.8,
      veg: false 
    },
    { 
      id: 30, 
      name: 'Pastel Romeu e Julieta', 
      description: 'Queijo com goiabada', 
      price: 5.50, 
      image: 'pastelfeira', 
      rating: 4.7,
      veg: true 
    },
    { 
      id: 31, 
      name: 'Pastel de Banana com Nutella', 
      description: 'Queijo, banana e nutella', 
      price: 6.00, 
      image: 'pastelfeira', 
      rating: 4.9,
      veg: true 
    }
  ],
  cafe: [
    { 
      id: 32, 
      name: 'Café Expresso', 
      description: 'Café espresso tradicional', 
      price: 1.00, 
      image: 'cafe', 
      rating: 4.5,
      veg: true 
    },
    { 
      id: 33, 
      name: 'Café Descafeinado', 
      description: 'Café espresso sem cafeína', 
      price: 1.00, 
      image: 'cafe', 
      rating: 4.3,
      veg: true 
    },
    { 
      id: 34, 
      name: 'Café Duplo', 
      description: 'Dose dupla de café espresso', 
      price: 2.00, 
      image: 'pastel', 
      rating: 4.6,
      veg: true 
    },
    { 
      id: 35, 
      name: 'Garoto', 
      description: 'Café com leite em proporção igual', 
      price: 1.00, 
      image: 'Garoto', 
      rating: 4.2,
      veg: true 
    },
    { 
      id: 36, 
      name: 'Abatanado', 
      description: 'Café longo estilo português', 
      price: 1.10, 
      image: 'abatanado', 
      rating: 4.1,
      veg: true 
    },
    { 
      id: 37, 
      name: 'Meia de Leite', 
      description: 'Café com leite em copo de vidro', 
      price: 1.50, 
      image: 'meialeite', 
      rating: 4.4,
      veg: true 
    },
    { 
      id: 38, 
      name: 'Galão', 
      description: 'Café com leite em copo alto', 
      price: 1.60, 
      image: 'galao', 
      rating: 4.5,
      veg: true 
    },
    { 
      id: 39, 
      name: 'Chá', 
      description: 'Infusão de ervas à escolha', 
      price: 1.60, 
      image: 'cha', 
      rating: 4.0,
      veg: true 
    },
    { 
      id: 40, 
      name: 'Cappuccino', 
      description: 'Café com leite vaporizado e espuma de leite', 
      price: 3.00, 
      image: 'capuccino', 
      rating: 4.7,
      veg: true 
    },
    { 
      id: 41, 
      name: 'Carioca de Limão', 
      description: 'Infusão de casca de limão', 
      price: 1.00, 
      image: 'cariocalimao', 
      rating: 3.9,
      veg: true 
    },
    { 
      id: 42, 
      name: 'Chocolate Quente', 
      description: 'Chocolate quente cremoso', 
      price: 3.00, 
      image: 'chocolatequente', 
      rating: 4.8,
      veg: true 
    },
    { 
      id: 43, 
      name: 'Torrada com Pão Caseiro', 
      description: 'Torrada feita com pão artesanal', 
      price: 2.00, 
      image: 'torradapaocaseiro', 
      rating: 4.3,
      veg: true 
    },
    { 
      id: 44, 
      name: 'Torrada com Pão de Forma', 
      description: 'Torrada feita com pão de forma', 
      price: 1.50, 
      image: 'torradapaodeforma', 
      rating: 4.1,
      veg: true 
    },
    { 
      id: 45, 
      name: 'Meia Torrada', 
      description: 'Meia porção de torrada', 
      price: 1.00, 
      image: 'torradapaocaseiro', 
      rating: 4.0,
      veg: true 
    },
    { 
      id: 46, 
      name: 'Croissant Misto', 
      description: 'Croissant com fiambre e queijo', 
      price: 3.00, 
      image: 'croissanmisto', 
      rating: 4.6,
      veg: false 
    },
    { 
      id: 47, 
      name: 'Croissant Misto Tostado', 
      description: 'Croissant com fiambre e queijo gratinado', 
      price: 3.20, 
      image: 'croissant', 
      rating: 4.7,
      veg: false 
    },
    { 
      id: 48, 
      name: 'Tosta Mista', 
      description: 'Tosta com fiambre e queijo', 
      price: 3.20, 
      image: 'tosta', 
      rating: 4.5,
      veg: false 
    },
    { 
      id: 49, 
      name: 'Tosta Mista (Pão de Forma)', 
      description: 'Tosta com fiambre e queijo em pão de forma', 
      price: 2.80, 
      image: 'tostamistapaoforma', 
      rating: 4.4,
      veg: false 
    },
    { 
      id: 50, 
      name: 'Sandes Mista', 
      description: 'Sandes com fiambre e queijo', 
      price: 2.20, 
      image: 'sandesmista', 
      rating: 4.2,
      veg: false 
    },
    { 
      id: 51, 
      name: 'Pão com Ovo', 
      description: 'Pão com ovo estrelado', 
      price: 2.20, 
      image: 'paocomovo', 
      rating: 4.1,
      veg: false 
    },
    { 
      id: 52, 
      name: 'Ovos com Bacon', 
      description: 'Ovos estrelados com bacon', 
      price: 4.00, 
      image: 'ovosebacaon', 
      rating: 4.7,
      veg: false 
    }
  ],
  bebidas: [
    { 
      id: 53, 
      name: 'Caipirinha', 
      description: 'Cachaça 51 ou Velho Barreiro, lima, açúcar e gelo', 
      price: 6.00, 
      image: 'caipirinha', 
      rating: 4.8,
      veg: true 
    },
    { 
      id: 54, 
      name: 'Caipiblack', 
      description: 'Cachaça preta, lima, açúcar e gelo', 
      price: 6.00, 
      image: 'Caipiblack', 
      rating: 4.9,
      veg: true 
    },
    { 
      id: 55, 
      name: 'Whiskey Jamenson', 
      description: 'Whiskey irlandês dose simples', 
      price: 3.50, 
      image: 'bebida', 
      rating: 4.7,
      veg: true 
    },
    { 
      id: 56, 
      name: 'Whiskey J&B', 
      description: 'Whiskey escocês dose simples', 
      price: 3.00, 
      image: 'bebida', 
      rating: 4.5,
      veg: true 
    },
    { 
      id: 57, 
      name: 'Whiskey Jack Daniels', 
      description: 'Whiskey americano dose simples', 
      price: 3.50, 
      image: 'bebida', 
      rating: 4.8,
      veg: true 
    },
    { 
      id: 58, 
      name: 'Whiskey Black Label', 
      description: 'Whiskey escocês premium dose simples', 
      price: 4.00, 
      image: 'bebida', 
      rating: 4.9,
      veg: true 
    },
    { 
      id: 59, 
      name: 'Vodka', 
      description: 'Vodka dose simples', 
      price: 4.00, 
      image: 'vodka', 
      rating: 4.6,
      veg: true 
    },
    { 
      id: 60, 
      name: 'Somersby', 
      description: 'Cidra de maçã', 
      price: 2.50, 
      image: 'Somersby',
      rating: 4.0,
      veg: true 
    },
    { 
      id: 61, 
      name: 'Imperial Heineken (0.20)', 
      description: 'Cerveja Heineken em copo de 20cl', 
      price: 1.50, 
      image: 'Imperial',
      rating: 4.2,
      veg: true 
    },
    { 
      id: 62, 
      name: 'Caneca Heineken (0.50)', 
      description: 'Cerveja Heineken em caneca de 50cl', 
      price: 3.00, 
      image: 'Imperial',
      rating: 4.5,
      veg: true 
    },
    { 
      id: 63, 
      name: 'Cerveja Garrafa (0.33ml)', 
      description: 'Cerveja em garrafa de 33ml', 
      price: 1.40, 
      image: 'cerveja',
      rating: 4.0,
      veg: true 
    },
    { 
      id: 64, 
      name: 'Cerveja Garrafa (0.33ml)', 
      description: 'Cerveja em garrafa de 33ml', 
      price: 1.40, 
      image: 'cerveja',
      rating: 4.0,
      veg: true 
    },
    { 
      id: 65, 
      name: 'Superbock Preta', 
      description: 'Cerveja escura Super Bock', 
      price: 1.40, 
      image: 'superbock',
      rating: 4.3,
      veg: true 
    },
    { 
      id: 66, 
      name: 'Energéticos', 
      description: 'Bebidas energéticas', 
      price: 2.50, 
      image: 'energetico',
      options: [
        { name: 'Red Bull', price: 2.50 },
        { name: 'Monster', price: 2.50 },
        { name: 'Hell', price: 1.80 }
      ],
      rating: 4.0,
      veg: true 
    }
  ],
  sumos: [
    {
      id: 67,
      name: 'Sumo/Batido de Maracujá',
      description: 'Rico em vitamina C e antioxidantes, ajuda a reduzir a ansiedade e melhorar a qualidade do sono',
      price: 4.00,
      baseOptions: { agua: 4.00, leite: 4.50 },
      image: 'maracuja',
      veg: true,
      nutritionalInfo: 'Alto teor de vitamina A, C, ferro e fibras. 120kcal (com água)',
      rating: 4.5
    },
    {
      id: 68,
      name: 'Sumo/Batido de Acerola',
      description: 'Uma das maiores fontes naturais de vitamina C, fortalece o sistema imunológico',
      price: 4.00,
      baseOptions: { agua: 4.00, leite: 4.50 },
      image: 'acerola',
      veg: true,
      nutritionalInfo: 'Contém 30x mais vitamina C que a laranja. 110kcal (com água)',
      rating: 4.6
    },
    {
      id: 69,
      name: 'Sumo/Batido de Manga',
      description: 'Doce e nutritivo, rico em vitamina A que beneficia a saúde ocular e da pele',
      price: 4.00,
      baseOptions: { agua: 4.00, leite: 4.50 },
      image: 'manga',
      veg: true,
      nutritionalInfo: 'Fonte de vitamina A, C e fibras. 150kcal (com água)',
      rating: 4.4
    },
    {
      id: 70,
      name: 'Sumo/Batido de Goiaba',
      description: 'Excelente fonte de licopeno e vitamina C, auxilia na saúde cardiovascular',
      price: 4.00,
      baseOptions: { agua: 4.00, leite: 4.50 },
      image: 'goiaba',
      veg: true,
      nutritionalInfo: 'Rica em antioxidantes e fibras. 130kcal (com água)',
      rating: 4.3
    },
    {
      id: 71,
      name: 'Sumo/Batido de Morango',
      description: 'Delicioso e rico em antioxidantes que combatem os radicais livres',
      price: 4.00,
      baseOptions: { agua: 4.00, leite: 4.50 },
      image: 'morango',
      veg: true,
      nutritionalInfo: 'Contém manganês, potássio e vitamina C. 100kcal (com água)',
      rating: 4.7
    },
    {
      id: 72,
      name: 'Sumo/Batido de Caju',
      description: 'Refrescante e rico em zinco, importante para a imunidade e saúde da pele',
      price: 4.00,
      baseOptions: { agua: 4.00, leite: 4.50 },
      image: 'Caju',
      veg: true,
      nutritionalInfo: 'Fonte de vitamina C e minerais. 140kcal (com água)',
      rating: 4.2
    },
    {
      id: 73,
      name: 'Sumo/Batido de Abacaxi',
      description: 'Contém bromelina, enzima que auxilia na digestão e reduz inflamações',
      price: 4.00,
      baseOptions: { agua: 4.00, leite: 4.50 },
      image: 'abacaxi',
      veg: true,
      nutritionalInfo: ' rico em vitamina C. 120kcal (com água)',
      rating: 4.5
    },
    {
      id: 74,
      name: 'Sumo/Batido de Coco',
      description: 'Hidratante natural, rico em eletrólitos e gorduras saudáveis',
      price: 4.00,
      baseOptions: { agua: 4.00, leite: 4.50 },
      image: 'coco',
      veg: true,
      nutritionalInfo: 'Fonte de minerais e ácidos graxos. 180kcal (com água)',
      rating: 4.4
    },
    {
      id: 75,
      name: 'Sumo/Batido de Cajá',
      description: 'Exótico e refrescante, rico em vitaminas do complexo B',
      price: 4.00,
      baseOptions: { agua: 4.00, leite: 4.50 },
      image: 'caja',
      veg: true,
      nutritionalInfo: 'Contém cálcio, fósforo e ferro. 130kcal (com água)',
      rating: 4.1
    },
    {
      id: 76,
      name: 'Sumo/Batido de Cupuaçu',
      description: 'Sabor único e cremoso, rico em antioxidantes e vitamina A',
      price: 4.00,
      baseOptions: { agua: 4.00, leite: 4.50 },
      image: 'cupuacu',
      veg: true,
      nutritionalInfo: 'Fonte de teobromina e ácidos graxos. 160kcal (com água)',
      rating: 4.3
    },
    {
      id: 77,
      name: 'Sumo/Batido de Graviola',
      description: 'Sabor tropical marcante, com propriedades que auxiliam no relaxamento',
      price: 4.00,
      baseOptions: { agua: 4.00, leite: 4.50 },
      image: 'graviola',
      veg: true,
      nutritionalInfo: 'Rica em vitaminas B1, B2 e C. 140kcal (com água)',
      rating: 4.2
    },
    {
      id: 78,
      name: 'Compal',
      description: 'Sumo de fruta natural engarrafado',
      price: 1.60,
      image: 'compal',
      flavorOptions: [
        'Frutos Vermelhos',
        'Maracujá',
        'Manga',
        'Maçã',
        'Pêra',
        'Pêssego',
        'Manga Laranja',
        'Goiaba',
        'Ananás'
      ],
      rating: 4.0,
      veg: true
    }
  ],
  'refrigerantes-aguas': [
    { 
      id: 79,
      name: 'Refrigerante Lata', 
      description: 'Refrigerantes em lata 330ml', 
      price: 1.60, 
      image: 'refrigerantes', 
      flavorOptions: [
        'Coca-Cola',
        'Coca-Cola Zero',
        'Fanta Laranja',
        'Pepsi',
        'Guaraná do Brasil',
        'Sprite'
      ],
      rating: 4.1,
      veg: true
    },
    { 
      id: 80,
      name: 'Água 1.5L', 
      description: 'Água mineral natural 1.5 litros', 
      price: 1.50, 
      image: 'agua', 
      rating: 4.0,
      veg: true
    },
    { 
      id: 81,
      name: 'Água 0.5L', 
      description: 'Água mineral natural 500ml', 
      price: 1.00, 
      image: 'agua', 
      rating: 4.0,
      veg: true
    },
    { 
      id: 82,
      name: 'Água 0.33L', 
      description: 'Água mineral natural 330ml', 
      price: 0.60, 
      image: 'agua', 
      rating: 4.0,
      veg: true
    },
    { 
      id: 83,
      name: 'Água Castelo', 
      description: 'Água mineral gaseificada 1L', 
      price: 1.40, 
      image: 'Castelo', 
      rating: 4.2,
      veg: true
    },
    { 
      id: 84,
      name: 'Água das Pedras', 
      description: 'Água mineral gaseificada', 
      price: 1.50, 
      image: 'pedras', 
      rating: 4.3,
      veg: true
    },
    { 
      id: 85,
      name: 'Água das Pedras C/ Sabor', 
      description: 'Água mineral gaseificada com sabor', 
      price: 1.80, 
      image: 'pedrassabor', 
      rating: 4.3,
      veg: true
    }
  ],
  salgados: [
    { 
      id: 86, 
      name: 'Pão de Queijo', 
      description: 'Pão de queijo tradicional mineiro', 
      price: 1.60, 
      image: 'paodequeijo', 
      rating: 4.5,
      veg: true
    },
    { 
      id: 87, 
      name: 'Pastel de Nata', 
      description: 'Pastel de nata tradicional português', 
      price: 1.30, 
      image: 'pasteldenata', 
      rating: 4.7,
      veg: true
    },
    { 
      id: 88, 
      name: 'Empada de Frango', 
      description: 'Empada recheada com frango', 
      price: 2.00, 
      image: 'empadafrango', 
      rating: 4.4,
      veg: false
    },
    { 
      id: 89, 
      name: 'Kibe', 
      description: 'Kibe frito tradicional', 
      price: 2.20, 
      image: 'kibe', 
      rating: 4.3,
      veg: false
    },
    { 
      id: 90, 
      name: 'Enroladinho de Salsicha e Queijo', 
      description: 'Massa crocante recheada com salsicha e queijo', 
      price: 2.20, 
      image: 'fiambre', 
      rating: 4.2,
      veg: false
    },
    { 
      id: 91, 
      name: 'Fiambre e Queijo', 
      description: 'Sanduíche de fiambre e queijo', 
      price: 2.20, 
      image: 'fiambreequeijo', 
      rating: 4.2,
      veg: false
    },
    { 
      id: 92, 
      name: 'Bauru', 
      description: 'Sanduíche de rosbife, queijo e tomate', 
      price: 2.20, 
      image: 'bauru', 
      rating: 4.1,
      veg: false
    },
    { 
      id: 93, 
      name: 'Bola de Queijo', 
      description: 'Bolinho de queijo frito', 
      price: 2.20, 
      image: 'bolaqueijo', 
      rating: 4.3,
      veg: true
    },
    { 
      id: 94, 
      name: 'Coxinha de Frango', 
      description: 'Coxinha de frango com catupiry', 
      price: 2.20, 
      image: 'Coxinha', 
      rating: 4.6,
      veg: false
    },
    { 
      id: 95, 
      name: 'Coxinha com Catupiry', 
      description: 'Coxinha de frango com recheio extra de catupiry', 
      price: 3.00, 
      image: 'Coxinha', 
      rating: 4.8,
      veg: false
    },
    { 
      id: 96, 
      name: 'Hamburgão', 
      description: 'Hambúrguer artesanal no pão', 
      price: 3.50, 
      image: 'hamburgao', 
      rating: 4.7,
      veg: false
    }
  ],
  sobremesas: [
    { 
      id: 97, 
      name: 'Bolo no Pote - Prestígio', 
      description: 'Bolo de chocolate com coco em pote individual', 
      price: 4.00, 
      image: 'Prestígio', 
      rating: 4.8,
      veg: true
    },
    { 
      id: 98, 
      name: 'Bolo no Pote - Chocolate', 
      description: 'Bolo de chocolate em pote individual', 
      price: 4.00, 
      image: 'doces', 
      rating: 4.9,
      veg: true
    },
    { 
      id: 99, 
      name: 'Bolo no Pote - Ananás', 
      description: 'Bolo de creme de ninho com pedaços de ananás em pote individual', 
      price: 4.00, 
      image: 'bolopoteananas', 
      rating: 4.7,
      veg: true
    },
    { 
      id: 100, 
      name: 'Bolo no Pote - Choco Misto', 
      description: 'Bolo de chocolate preto com ninho em pote individual', 
      price: 4.00, 
      image: 'doces', 
      rating: 4.8,
      veg: true
    },
    { 
      id: 101, 
      name: 'Cheesecake - Goiabada', 
      description: 'Fatia de cheesecake com cobertura de goiabada', 
      price: 3.50, 
      image: 'Cheesecake', 
      rating: 4.7,
      veg: true
    },
    { 
      id: 102, 
      name: 'Cheesecake - Frutos Vermelhos', 
      description: 'Fatia de cheesecake com cobertura de frutos vermelhos', 
      price: 3.50, 
      image: 'frutosvermelhos', 
      rating: 4.8,
      veg: true
    },
    { 
      id: 103, 
      name: 'Brigadeiro Tradicional', 
      description: 'Brigadeiro tradicional brasileiro', 
      price: 1.50, 
      image: 'doces', 
      rating: 4.6,
      veg: true
    },
    { 
      id: 104, 
      name: 'Brigadeiro Beijinho', 
      description: 'Brigadeiro de coco ralado', 
      price: 1.50, 
      image: 'doces', 
      rating: 4.5,
      veg: true
    },
    { 
      id: 105, 
      name: 'Brigadeiro Ninjo', 
      description: 'Brigadeiro feito com leite ninho', 
      price: 2.00, 
      image: 'doces', 
      rating: 4.8,
      veg: true
    },
    { 
      id: 106, 
      name: 'Brigadeiro Paçoca', 
      description: 'Brigadeiro com paçoca', 
      price: 2.00, 
      image: 'doces', 
      rating: 4.7,
      veg: true
    },
    { 
      id: 107, 
      name: 'Brigadeiro Morango', 
      description: 'Brigadeiro sabor morango', 
      price: 2.00, 
      image: 'doces', 
      rating: 4.8,
      veg: true
    },
    { 
      id: 108, 
      name: 'Brigadeiro Churros', 
      description: 'Brigadeiro sabor churros', 
      price: 2.00, 
      image: 'doces', 
      rating: 4.9,
      veg: true
    },
    { 
      id: 109, 
      name: 'Tarte de Toblerone', 
      description: 'Fatia de tarte com chocolate Toblerone', 
      price: 2.20, 
      image: 'toblerone', 
      rating: 4.7,
      veg: true
    },
    { 
      id: 110, 
      name: 'Bolo de Brigadeiro (fatia)', 
      description: 'Fatia de bolo de brigadeiro', 
      price: 2.20, 
      image: 'doces', 
      rating: 4.8,
      veg: true
    }
  ]
};

  // Obter nome do dia da semana
  const getDayName = () => {
    const days = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
    return days[new Date().getDay()];
  };

  // Obter nome do prato do dia
  const getDailySpecialName = () => {
    switch(dailySpecialId) {
      case 1: return 'Frango Cremoso';
      case 2: return 'Maminha Top';
      case 3: return 'Costela Raiz';
      case 4: return 'Frango Supremo';
      case 5: return 'Feijoada Astral';
      case 6: return 'Opção Vegetariana';
      default: return null;
    }
  };

  useEffect(() => {
  if (orderStatus) {
    console.log("OrderStatus atualizado:", orderStatus);
    
    // Configura um timeout para limpar automaticamente após 8 segundos (tempo da progress bar)
    const timer = setTimeout(() => {
      if (orderStatus === 'Pedido Recebido com Sucesso!' || 
          orderStatus.includes('Erro') || 
          orderStatus === 'Enviando...') {
        setOrderStatus('');
      }
    }, 8000); // Match com a duração da progress bar

    return () => clearTimeout(timer);
  }
}, [orderStatus]);

  return (
    <div className="min-h-screen bg-white text-gray-800 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-lg sticky top-0 z-50 pt-safe-top">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg shadow-md">
                <img src={logo} alt="Logo Alto Astral" className="h-10 w-10" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-black drop-shadow-md">Alto Astral</h1>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="bg-white rounded-full px-4 py-2 shadow-lg border-2 border-[#e6be44]">
                <span className="font-bold text-black text-lg">Mesa: </span>
                <span className="font-extrabold text-black text-xl">{tableNumber}</span>
              </div>
              
              <button 
                onClick={() => setShowCart(!showCart)}
                className="relative p-3  text-black rounded-full shadow-lg  transition-colors flex items-center"
              >
                <FaCartPlus className="h-6 w-6" />
                {cart.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-black text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {cart.reduce((sum, item) => sum + (item.quantity || 1), 0)}
                  </span>
                )}
                {!isMobile && (
                  <span className="ml-2 hidden md:inline-block font-medium text-black">
                    {formatPrice(calculateTotal())}
                  </span>
                )}
              </button>
            </div>
          </div>
{orderStatus && (
  <motion.div
    initial={{ opacity: 0, y: -20, scale: 0.95 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    exit={{ opacity: 0, y: -20, scale: 0.95 }}
    transition={{ 
      type: 'spring',
      damping: 25,
      stiffness: 120,
      mass: 0.5
    }}
    className="fixed inset-x-0 top-6 mx-auto max-w-md z-[100] px-4"
  >
    <div className={`
      relative rounded-xl shadow-2xl overflow-hidden
      ${orderStatus.includes('Erro') ? 'bg-gradient-to-br from-red-600 to-red-700' :
        orderStatus === 'Pedido Recebido com Sucesso!' ? 
        'bg-gradient-to-br from-green-600 to-green-700' : 
        'bg-gradient-to-br from-[#e6be44] to-[#d4a72c]'}
      border ${orderStatus.includes('Erro') ? 'border-red-500' :
        orderStatus === 'Pedido Recebido com Sucesso!' ? 'border-green-500' : 'border-[#e6be44]'}
    `}>
      {/* Main notification content */}
      <div className="p-4 flex items-start">
        {/* Animated icon */}
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            rotate: orderStatus.includes('Erro') ? [0, 10, -10, 0] : [0, 5, -5, 0]
          }}
          transition={{
            duration: 0.6,
            repeat: orderStatus.includes('Erro') ? Infinity : 0,
            repeatType: 'reverse'
          }}
          className="flex-shrink-0"
        >
          {orderStatus.includes('Erro') ? (
            <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ) : (
            <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          )}
        </motion.div>

        {/* Text content */}
        <div className="ml-3 flex-1 pt-0.5 min-w-0">
          <p className="text-sm font-semibold text-white truncate">
            {orderStatus}
          </p>
          {orderStatus === 'Pedido Recebido com Sucesso!' && (
            <p className="mt-1 text-sm text-white/90">
              Agora é só aguardar, estamos preparando seu pedido com cuidado.
            </p>
          )}
        </div>

        {/* Close button */}
        <button
          onClick={() => setOrderStatus('')}
          className="ml-4 flex-shrink-0 flex items-center justify-center h-7 w-7 rounded-full hover:bg-white/10 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white/50"
        >
          <svg className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>

      {/* Enhanced Progress Bar */}
      {orderStatus === 'Pedido Recebido com Sucesso!' && (
        <div className="relative h-1.5 bg-white/20">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: '100%' }}
            transition={{ 
              duration: 8, // Duração aumentada para 8 segundos
              ease: 'linear'
            }}
            className="absolute top-0 left-0 h-full bg-white/80"
          >
            <motion.div
              animate={{
                opacity: [0, 0.5, 0],
                right: ['0%', '0%', '100%']
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
              className="absolute top-0 h-full w-8 bg-white"
              style={{
                boxShadow: '0 0 10px 2px rgba(255,255,255,0.8)'
              }}
            />
          </motion.div>
        </div>
      )}
    </div>
  </motion.div>
)}

          {showItemAdded && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-20 right-4 bg-[#84a66d] text-white px-4 py-2 rounded-lg shadow-lg flex items-center"
            >
              <FaCheck className="mr-2" />
              Item adicionado ao carrinho!
            </motion.div>
          )}
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <div className={`flex-1 overflow-y-auto ${showCart && !isMobile ? 'w-2/3' : 'w-full'}`}>
          <div className="container mx-auto px-4 py-6">
            <div className="mb-6 overflow-x-auto scrollbar-hide">
              <div className="flex space-x-2 pb-2">
                {Object.keys(menu).map(category => (
                  <button
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    className={`px-4 py-2 rounded-full whitespace-nowrap font-bold text-sm transition-all flex items-center ${
                      activeCategory === category 
                        ? 'bg-[#918e89] text-black shadow-md' 
                        : 'bg-[#b0aca6] text-white'
                    }`}
                  >
                    {getCategoryIcon(category)}
                    {category === 'semana' ? 'Cardápio' : 
                     category === 'lanches' ? 'Lanches' : 
                     category === 'porcoes' ? 'Porções' : 
                     category === 'pasteis' ? 'Pastéis' : 
                     category === 'cafe' ? 'Café' : 
                     category === 'bebidas' ? 'Bebidas' : 
                     category === 'refrigerantes-aguas' ? 'Refrigerantes & Águas' :
                     category === 'salgados' ? 'Salgados' : 
                     category === 'sumos' ? 'Sumos & Batidos' :
                     'Sobremesas'}
                  </button>
                ))}
              </div>
            </div>

        {activeCategory === 'pasteis' ? (
        <div className="space-y-12">
          {/* Hero Section para Pastéis com informação de horário */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <motion.div
              animate={{ rotate: [0, 15, -15, 0] }}
              transition={{ repeat: Infinity, repeatType: "reverse", duration: 4 }}
              className="inline-block mb-6"
            >
              <GiHamburger className="text-5xl text-[#e6be44]" />
            </motion.div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#e6be44] to-[#b0aca6]">
                Pastéis Crocantes
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Diversos recheios para todos os gostos
            </p>
            
            {/* Aviso sobre horário dos pastéis */}
            <motion.div 
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 500 }}
              className="mt-6 inline-block bg-gradient-to-r from-[#e6be44] to-[#d5c8b6] p-1 rounded-full shadow-lg"
            >
              <div className="bg-white px-6 py-2 rounded-full">
                <div className="flex items-center justify-center space-x-2">
                  <FaClock className="text-[#e6be44] text-xl" />
                  <span className="font-bold text-gray-800">
                    Horário: <span className="text-[#e6be44]">Seg-Sex a partir das 15h | Sábado o dia todo</span>
                  </span>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredMenu(activeCategory).map((item) => {
              const pastelAvailable = isPastelAvailable();
              const available = isItemAvailable(item.id);
              const addToCartWithAnimation = () => {
                if (!pastelAvailable) return;
                setIsAdding(true);
                addToCart(item);
                setTimeout(() => setIsAdding(false), 1000);
              };

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  whileHover={{ y: pastelAvailable ? -5 : 0 }}
                  className={`bg-white rounded-2xl shadow-xl overflow-hidden border ${
                    pastelAvailable ? 'border-[#d5c8b6]/30' : 'border-gray-200'
                  } flex flex-col relative`}
                >
                  {/* Overlay de indisponibilidade */}
                  {!pastelAvailable && (
                    <div className="absolute inset-0 bg-black/10 z-10 rounded-2xl flex items-center justify-center">
                      <div className="bg-white/90 p-3 rounded-lg text-center">
                        <FaClock className="text-gray-500 text-2xl mx-auto mb-2" />
                        <p className="text-gray-700 font-medium">Disponível {new Date().getDay() === 6 ? 'hoje' : 'após 15h'}</p>
                      </div>
                    </div>
                  )}

                  {/* Image com overlay elegante */}
                  <div className="relative h-64 w-full overflow-hidden">
                    <LazyLoadImage
                      src={foodImages[item.image]}
                      alt={item.name}
                      className="absolute top-0 left-0 w-full h-full object-cover"
                      effect="blur"
                      width="100%"
                      height="100%"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                    
                    {/* Favorite button com animação */}
                    <motion.button
                      onClick={() => toggleFavorite(item.id)}
                      className="absolute top-4 right-4 p-2 bg-white/90 rounded-full shadow-sm z-20"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <FaHeart 
                        className={`w-5 h-5 transition-colors ${
                          favorites.includes(item.id) 
                            ? 'text-red-500 fill-red-500' 
                            : 'text-gray-400'
                        }`}
                      />
                    </motion.button>
                  </div>

                  {/* Product Info */}
                  <div className="p-5 flex-grow flex flex-col">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-xl font-bold text-gray-900">{item.name}</h3>
                    </div>
                    
                    {item.description && (
                      <p className="text-gray-600 mb-4 flex-grow">{item.description}</p>
                    )}
                    
                    {/* Notes input */}
                    <div className="mb-4">
                      <label htmlFor={`notes-${item.id}`} className="block text-sm font-medium text-gray-500 mb-1">
                        Observações (opcional)
                      </label>
                      <input
                        id={`notes-${item.id}`}
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                        placeholder="Ex: bem frito, mais recheio, etc."
                        value={itemNotes[item.id] || ''}
                        onChange={(e) => updateItemNotes(item.id, e.target.value)}
                        disabled={!pastelAvailable}
                      />
                    </div>

                    {/* Add to Cart Button */}
                    <motion.button
                      onClick={addToCartWithAnimation}
                      disabled={!pastelAvailable}
                      className={`mt-auto w-full ${
                        pastelAvailable 
                          ? 'bg-[#918e89] text-[#e6be44] hover:bg-[#b0aca6]' 
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      } font-bold py-3 rounded-lg flex items-center justify-center relative overflow-hidden`}
                      whileHover={pastelAvailable ? { 
                        y: -2,
                        boxShadow: '0 5px 15px rgba(0,0,0,0.1)'
                      } : {}}
                      whileTap={pastelAvailable ? { scale: 0.98 } : {}}
                    >
                      {!pastelAvailable ? (
                        <span className="flex items-center">
                          <FaClock className="mr-2" />
                          Indisponível no momento
                        </span>
                      ) : isAdding ? (
                        <motion.span
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          className="flex items-center"
                        >
                          <FiCheck className="mr-2" />
                          Adicionado!
                        </motion.span>
                      ) : (
                        <motion.span
                          initial={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 20 }}
                          className="flex items-center"
                        >
                          <FiPlus className="mr-2" />
                          Adicionar
                        </motion.span>
                      )}
                      
                      {/* Efeito de fundo animado */}
                      {isAdding && pastelAvailable && (
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: '100%' }}
                          transition={{ duration: 1 }}
                          className="absolute bottom-0 left-0 h-1 bg-[#e6be44]"
                        />
                      )}
                    </motion.button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      ) : activeCategory === 'sumos' ? (
  <div className="space-y-12">
    {/* Hero Section */}
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="text-center"
    >
      <motion.div
        animate={{ rotate: [0, 15, -15, 0] }}
        transition={{ repeat: Infinity, repeatType: "reverse", duration: 4 }}
        className="inline-block mb-6"
      >
        <GiFruitBowl className="text-5xl text-[#e6be44]" />
      </motion.div>
      <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#e6be44] to-[#b0aca6]">
          Sumos & Batidos
        </span>
      </h1>
      <p className="text-xl text-gray-600 max-w-2xl mx-auto">
        Preparados na hora com polpas naturais, 100% fruta e sem adição de açúcar
      </p>
    </motion.div>

    {/* Product Grid */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      
       {filteredMenu(activeCategory)?.map((item) => {
        const addToCartWithAnimation = () => {
          if (item.id === 78 && !localSelectedFlavor) return;
          
          const newItem = item.id === 78
            ? {
                ...item,
                name: `${item.name} (${localSelectedFlavor})`,
                price: item.price,
                notes: itemNotes[item.id] || undefined,
                flavor: localSelectedFlavor,
                quantity: 1,
                cartId: `${item.id}-${Date.now()}`
              }
            : {
                ...item,
                price: localSelectedBase === 'leite' 
                  ? (item.baseOptions?.leite || item.price)
                  : (item.baseOptions?.agua || item.price),
                notes: `Base: ${localSelectedBase === 'agua' ? 'Água' : 'Leite'}${itemNotes[item.id] ? ` | ${itemNotes[item.id]}` : ''}`,
                quantity: 1,
                cartId: `${item.id}-${Date.now()}`
              };
          
          setCart(prevCart => [...prevCart, newItem]);
          setShowItemAdded(true);
        };

        return (
          <motion.div
            key={`${item.id}`}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            whileHover={{ y: -5 }}
            className="bg-white rounded-2xl shadow-xl overflow-hidden border border-[#d5c8b6]/30 flex flex-col"
          >
            {/* Image */}
            <div className="relative h-64 w-full overflow-hidden">
              <LazyLoadImage
                src={foodImages[item.image]}
                alt={item.name}
                className="absolute top-0 left-0 w-full h-full object-cover"
                effect="blur"
                width="100%"
                height="100%"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>

            {/* Product Info */}
            <div className="p-5 flex-grow flex flex-col">
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-xl font-bold text-gray-900">{item.name}</h3>
                <div className="text-xl font-bold text-black">
                  {formatPrice(
                    item.id === 78 
                      ? item.price 
                      : localSelectedBase === 'leite' 
                        ? (item.baseOptions?.leite || item.price)
                        : (item.baseOptions?.agua || item.price)
                  )}
                </div>
              </div>
              
              <p className="text-gray-600 mb-4 flex-grow">{item.description}</p>
              
              {item.id === 78 && item.flavorOptions && (
                <div className="mb-4">
                  <label htmlFor={`flavor-${item.id}`} className="block text-sm font-medium text-gray-500 mb-1">
                    Escolha o sabor:
                  </label>
                  <select
                    id={`flavor-${item.id}`}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    value={localSelectedFlavor}
                    onChange={(e) => setLocalSelectedFlavor(e.target.value)}
                  >
                    <option value="">Selecione...</option>
                    {item.flavorOptions.map(flavor => (
                      <option key={flavor} value={flavor}>{flavor}</option>
                    ))}
                  </select>
                </div>
              )}

              {item.id !== 78 && (
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-500">Base:</span>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setLocalSelectedBase('agua')}
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          localSelectedBase === 'agua' 
                            ? 'bg-[#e6be44] text-white' 
                            : 'bg-[#f3f3f3] text-gray-700'
                        }`}
                      >
                        Água
                      </button>
                      <button
                        onClick={() => setLocalSelectedBase('leite')}
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          localSelectedBase === 'leite' 
                            ? 'bg-[#e6be44] text-white' 
                            : 'bg-[#f3f3f3] text-gray-700'
                        }`}
                      >
                        Leite
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <div className="mb-4">
                <label htmlFor={`notes-${item.id}`} className="block text-sm font-medium text-gray-500 mb-1">
                  Observações (opcional)
                </label>
                <input
                  id={`notes-${item.id}`}
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  placeholder={item.id === 78 ? "Ex: sem gelo, etc." : "Ex: sem açúcar, mais gelo, etc."}
                  value={itemNotes[item.id] || ''}
                  onChange={(e) => updateItemNotes(item.id, e.target.value)}
                />
              </div>

              <button
                  onClick={addToCartWithAnimation}
                  className="mt-auto w-full bg-[#918e89] text-[#e6be44] hover:bg-[#b0aca6] font-bold py-3 rounded-lg"
                >
                  Adicionar
                </button>

            </div>
          </motion.div>
        );
      })}
    </div>
  </div>
) : activeCategory === 'refrigerantes-aguas' ? (
  <div className="space-y-12">
    {/* Premium Hero Section for Drinks */}
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="text-center"
    >
      <motion.div
        animate={{ rotate: [0, 15, -15, 0] }}
        transition={{ repeat: Infinity, repeatType: "reverse", duration: 4 }}
        className="inline-block mb-6"
      >
        <GiWaterBottle className="text-5xl text-[#e6be44]" />
      </motion.div>
      <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#e6be44] to-[#b0aca6]">
          Refrigerantes & Águas
        </span>
      </h1>
      <p className="text-xl text-gray-600 max-w-2xl mx-auto">
        Bebidas geladas disponíveis no freezer - Verifique as opções disponíveis e especifique sua preferência nas observações
      </p>
    </motion.div>

    {/* Premium Drink Grid */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {filteredMenu(activeCategory).map((item) => {
        const addToCartWithAnimation = () => {
          setIsAdding(true);
          
          // Lógica para refrigerantes com sabores
          if (item.flavorOptions) {
            const selectedFlavor = selectedFlavors[item.id];
            const notes = [
              itemNotes[item.id] || ''
            ].filter(Boolean).join(' | ');

            if (!selectedFlavor) {
              alert('Por favor, selecione um sabor');
              setIsAdding(false);
              return;
            }

            addToCart({
              ...item,
              name: `${item.name} (${selectedFlavor})`,
              price: item.price,
              notes: notes || undefined
            });
          } 
          // Lógica para energéticos
          else if (item.options) {
            const selectedOption = item.options.find(opt => 
              opt.name === selectedEnergyDrinks[item.id]
            );
            
            if (!selectedOption) {
              alert('Por favor, selecione uma opção');
              setIsAdding(false);
              return;
            }

            addToCart({
              ...item,
              name: `${item.name} - ${selectedOption.name}`,
              price: selectedOption.price,
              notes: itemNotes[item.id] || undefined
            });
          } 
          // Lógica para itens sem seleção (águas, etc)
          else {
            addToCart({
              ...item,
              notes: itemNotes[item.id] || undefined
            });
          }

          setTimeout(() => setIsAdding(false), 1000);
        };

        return (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            whileHover={{ y: -5 }}
            className="bg-white rounded-2xl shadow-xl overflow-hidden border border-[#d5c8b6]/30 flex flex-col"
          >
            {/* Image with frost effect */}
            <div className="relative h-64 w-full overflow-hidden">
              <LazyLoadImage
                src={foodImages[item.image]}
                alt={item.name}
                className="absolute top-0 left-0 w-full h-full object-cover"
                effect="blur"
                width="100%"
                height="100%"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              <div className="absolute inset-0 bg-blue-50/10 backdrop-blur-[1px]" />
              
              {/* Frost icon */}
              <div className="absolute top-4 right-4 p-2 bg-white/80 rounded-full shadow-md">
                <FaSnowflake className="text-blue-400 w-5 h-5" />
              </div>
              
              {/* Favorite button */}
              <motion.button
                onClick={() => toggleFavorite(item.id)}
                className="absolute top-4 left-4 p-2 bg-white/90 rounded-full shadow-sm"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <FaHeart 
                  className={`w-5 h-5 transition-colors ${
                    favorites.includes(item.id) 
                      ? 'text-red-500 fill-red-500' 
                      : 'text-gray-400'
                  }`}
                />
              </motion.button>
            </div>

            {/* Product Info */}
            <div className="p-5 flex-grow flex flex-col">
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-xl font-bold text-gray-900">{item.name}</h3>
                <div className="text-xl font-bold text-black">
                  {item.options ? (
                    selectedEnergyDrinks[item.id] ? 
                      formatPrice(item.options.find(opt => opt.name === selectedEnergyDrinks[item.id])?.price || 0)
                    : 'Selecione'
                  ) : formatPrice(item.price)}
                </div>
              </div>
              
              {/* Select para sabores de refrigerante */}
              {item.flavorOptions && (
                <div className="mb-4">
                  <label htmlFor={`flavor-${item.id}`} className="block text-sm font-medium text-gray-500 mb-1">
                    Escolha o sabor:
                  </label>
                  <select
                    id={`flavor-${item.id}`}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    value={selectedFlavors[item.id] || ''}
                    onChange={(e) => setSelectedFlavors(prev => ({
                      ...prev,
                      [item.id]: e.target.value
                    }))}
                  >
                    <option value="">Selecione...</option>
                    {item.flavorOptions.map(flavor => (
                      <option key={flavor} value={flavor}>{flavor}</option>
                    ))}
                  </select>
                </div>
              )}
              
              {/* Select para marcas de energético */}
              {item.options && (
                <div className="mb-4">
                  <label htmlFor={`energy-${item.id}`} className="block text-sm font-medium text-gray-500 mb-1">
                    Escolha a marca:
                  </label>
                  <select
                    id={`energy-${item.id}`}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    value={selectedEnergyDrinks[item.id] || ''}
                    onChange={(e) => {
                      const selectedOption = item.options.find(opt => opt.name === e.target.value);
                      setSelectedEnergyDrinks(prev => ({
                        ...prev,
                        [item.id]: e.target.value
                      }));
                    }}
                  >
                    <option value="">Selecione...</option>
                    {item.options.map(option => (
                      <option key={option.name} value={option.name}>
                        {option.name} ({formatPrice(option.price)})
                      </option>
                    ))}
                  </select>
                </div>
              )}
              
              <p className="text-gray-600 mb-4 flex-grow">{item.description}</p>
              
              {/* Notes input */}
              <div className="mb-4">
                <label htmlFor={`notes-${item.id}`} className="block text-sm font-medium text-gray-500 mb-1">
                  Observações (opcional)
                </label>
                <input
                  id={`notes-${item.id}`}
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  placeholder="Ex: Coca-Cola Zero, etc."
                  value={itemNotes[item.id] || ''}
                  onChange={(e) => updateItemNotes(item.id, e.target.value)}
                />
              </div>

              {/* Important Notice */}
              <div className="mb-4 bg-blue-50/50 p-3 rounded-lg border border-blue-100">
                <p className="text-xs text-blue-600 flex items-center">
                  <FaSnowflake className="mr-2" />
                  Verifique as bebidas disponíveis no freezer e especifique sua preferência nas observações
                </p>
              </div>

              {/* Add to Cart Button */}
              <motion.button
                onClick={addToCartWithAnimation}
                className={`mt-auto w-full bg-[#918e89] text-[#e6be44] font-bold py-3 rounded-lg flex items-center justify-center relative overflow-hidden`}
                whileHover={{ 
                  y: -2,
                  boxShadow: '0 5px 15px rgba(0,0,0,0.1)'
                }}
                whileTap={{ scale: 0.98 }}
              >
                {isAdding ? (
                  <motion.span
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="flex items-center"
                  >
                    <FiCheck className="mr-2" />
                    Adicionado!
                  </motion.span>
                ) : (
                  <motion.span
                    initial={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    className="flex items-center"
                  >
                    <FiPlus className="mr-2" />
                    Adicionar
                  </motion.span>
                )}
                
                {/* Animated background effect */}
                {isAdding && (
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 1 }}
                    className="absolute bottom-0 left-0 h-1 bg-[#e6be44]"
                  />
                )}
              </motion.button>
            </div>
          </motion.div>
        );
      })}
    </div>
  </div>
            ) : activeCategory === 'semana' ? (
  <div className="space-y-12">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="text-center"
    >
      <motion.div
        animate={{ rotate: [0, 15, -15, 0] }}
        transition={{ repeat: Infinity, repeatType: "reverse", duration: 4 }}
        className="inline-block mb-6"
      >
        <GiMeal className="text-5xl text-[#e6be44]" />
      </motion.div>
      <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#e6be44] to-[#b0aca6]">
          Cardápio do Dia
        </span>
      </h1>
      <p className="text-xl text-gray-600 max-w-2xl mx-auto">
        Pratos deliciosos preparados com ingredientes frescos e selecionados
      </p>
      
      {dailySpecialId && (
        <motion.div 
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 500 }}
          className="mt-6 inline-block bg-gradient-to-r from-[#e6be44] to-[#d5c8b6] p-1 rounded-full shadow-lg"
        >
          <div className="bg-white px-6 py-2 rounded-full">
            <div className="flex items-center justify-center space-x-2">
              <FaBirthdayCake className="text-[#e6be44] text-xl" />
              <span className="font-bold text-gray-800">
                {getDayName()}: <span className="text-[#e6be44]">{getDailySpecialName()}</span>
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {filteredMenu(activeCategory).map((item) => {
        const addToCartWithAnimation = () => {
          if (!checkAvailability(item.id)) return;
          setIsAdding(true);
          addToCart(item);
          setTimeout(() => setIsAdding(false), 1000);
        };

        return (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            whileHover={{ y: checkAvailability(item.id) ? -5 : 0 }}
            className={`bg-white rounded-2xl shadow-xl overflow-hidden border ${
              checkAvailability(item.id) ? 'border-[#e6be44]' : 'border-gray-200 opacity-70'
            } flex flex-col relative`}
          >
            <div className="relative h-64 w-full overflow-hidden">
              <LazyLoadImage
                src={foodImages[item.image]}
                alt={item.name}
                className="absolute top-0 left-0 w-full h-full object-cover"
                effect="blur"
                width="100%"
                height="100%"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              
              {item.veg && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="absolute top-4 left-4 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg"
                >
                  VEGETARIANO
                </motion.div>
              )}
              
              <motion.button
                onClick={() => toggleFavorite(item.id)}
                className="absolute top-4 right-4 p-2 bg-white/90 rounded-full shadow-sm"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <FaHeart 
                  className={`w-5 h-5 transition-colors ${
                    favorites.includes(item.id) 
                      ? 'text-red-500 fill-red-500' 
                      : 'text-gray-400'
                  }`}
                />
              </motion.button>
            </div>

            <div className="p-5 flex-grow flex flex-col">
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-xl font-bold text-gray-900">
                  {item.name}
             
                </h3>
                <div className="text-xl font-bold text-black">
                  {formatPrice(item.price)}
                </div>
              </div>
              
              {item.description && (
                <p className="text-gray-600 mb-4 flex-grow">{item.description}</p>
              )}
              
              <div className="mb-4">
                <label htmlFor={`notes-${item.id}`} className="block text-sm font-medium text-gray-500 mb-1">
                  Observações (opcional)
                </label>
                <input
                  id={`notes-${item.id}`}
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  placeholder="Ex: sem cebola, bem passado, etc."
                  value={itemNotes[item.id] || ''}
                  onChange={(e) => updateItemNotes(item.id, e.target.value)}
                  disabled={!checkAvailability(item.id)}
                />
              </div>

              <button
                onClick={() => checkAvailability(item.id) && addToCartWithAnimation()}
                disabled={!checkAvailability(item.id)}
                className={`mt-auto w-full ${
                  checkAvailability(item.id)
                    ? 'bg-[#918e89] text-[#e6be44] hover:bg-[#b0aca6]'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                } font-bold py-3 rounded-lg transition-colors duration-200`}
              >
                {checkAvailability(item.id) ? (
                  <span className="flex items-center justify-center">
                    <FiPlus className="mr-2" />
                    Adicionar
                  </span>
                ) : (
                  <span className="flex items-center justify-center">
                    <FaClock className="mr-2" />
                    Indisponível
                  </span>
                )}
              </button>
            </div>
          </motion.div>
        );
      })}
    </div>
  </div>
) : (
              <div className="space-y-12">
                {/* Hero Section for other categories */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="text-center"
                >
                  <motion.div
                    animate={{ rotate: [0, 15, -15, 0] }}
                    transition={{ repeat: Infinity, repeatType: "reverse", duration: 4 }}
                    className="inline-block mb-6"
                  >
                    {getCategoryIcon(activeCategory)}
                  </motion.div>
                  <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#e6be44] to-[#b0aca6]">
                      {activeCategory === 'lanches' ? 'Lanches' : 
                       activeCategory === 'porcoes' ? 'Porções' : 
                       activeCategory === 'pasteis' ? 'Pastéis' : 
                       activeCategory === 'cafe' ? 'Café' : 
                       activeCategory === 'bebidas' ? 'Bebidas' : 
                       activeCategory === 'salgados' ? 'Salgados' : 
                       'Sobremesas'}
                    </span>
                  </h1>
                  <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                    {activeCategory === 'lanches' ? 'Sanduíches e lanches para todos os gostos' : 
                     activeCategory === 'porcoes' ? 'Porções generosas para compartilhar' : 
                     activeCategory === 'pasteis' ? 'Pastéis crocantes com diversos recheios' : 
                     activeCategory === 'cafe' ? 'Bebidas quentes e acompanhamentos para seu café' : 
                     activeCategory === 'bebidas' ? 'Bebidas alcoólicas e coquetéis especiais' : 
                     activeCategory === 'salgados' ? 'Salgadinhos frescos e saborosos' : 
                     'Sobremesas doces para finalizar sua refeição'}
                  </p>
                </motion.div>

                {/* Product Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredMenu(activeCategory).map((item) => {
                    const addToCartWithAnimation = () => {
  setIsAdding(true);
  
  // Lógica APENAS para energéticos (itens com options)
  if (item.options) {
    const selectedOption = item.options.find(opt => 
      opt.name === selectedEnergyDrinks[item.id]
    );
    
    if (!selectedOption) {
      alert('Por favor, selecione uma marca de energético');
      setIsAdding(false);
      return;
    }

    addToCart({
      ...item,
      name: `${item.name} (${selectedOption.name})`,
      price: selectedOption.price,
      notes: itemNotes[item.id] || undefined
    });
  } 
  // Lógica padrão para todos os outros itens
  else {
    addToCart({
      ...item,
      notes: itemNotes[item.id] || undefined
    });
  }

  setTimeout(() => setIsAdding(false), 1000);
};
                    return (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        whileHover={{ y: -5 }}
                        onHoverStart={() => setIsHovered(true)}
                        onHoverEnd={() => setIsHovered(false)}
                        className="bg-white rounded-2xl shadow-xl overflow-hidden border border-[#d5c8b6]/30 flex flex-col"
                      >
                        {/* Image with elegant overlay */}
                        <div className="relative h-64 w-full overflow-hidden">
                          <LazyLoadImage
                            src={foodImages[item.image]}
                            alt={item.name}
                            className="absolute top-0 left-0 w-full h-full object-cover"
                            effect="blur"
                            width="100%"
                            height="100%"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                          
                          {/* Favorite button with animation */}
                          <motion.button
                            onClick={() => toggleFavorite(item.id)}
                            className="absolute top-4 right-4 p-2 bg-white/90 rounded-full shadow-sm"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <FaHeart 
                              className={`w-5 h-5 transition-colors ${
                                favorites.includes(item.id) 
                                  ? 'text-red-500 fill-red-500' 
                                  : 'text-gray-400'
                              }`}
                            />
                          </motion.button>
                        </div>
                        
                        {/* Product Info */}
                        <div className="p-5 flex-grow flex flex-col">
                          <div className="flex justify-between items-start mb-3">
                            <h3 className="text-xl font-bold text-gray-900">{item.name}</h3>
                            <motion.div
                              animate={{ 
                                scale: isHovered ? 1.1 : 1,
                                color: isHovered ? '#e6be44' : '#000'
                              }}
                              className="text-xl font-bold"
                            >
                              {formatPrice(item.price)}
                            </motion.div>
                          </div>
                          
                          {item.description && (
                            <p className="text-gray-600 mb-4 flex-grow">{item.description}</p>
                          )}
                          {/* Select para marcas de energético */}
{item.options && (
  <div className="mb-4">
    <label htmlFor={`energy-${item.id}`} className="block text-sm font-medium text-gray-500 mb-1">
      Escolha a marca:
    </label>
    <select
      id={`energy-${item.id}`}
      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
      value={selectedEnergyDrinks[item.id] || ''}
      onChange={(e) => {
        const selectedOption = item.options.find(opt => opt.name === e.target.value);
        setSelectedEnergyDrinks(prev => ({
          ...prev,
          [item.id]: e.target.value
        }));
      }}
    >
      <option value="">Selecione...</option>
      {item.options.map(option => (
        <option key={option.name} value={option.name}>
          {option.name} ({formatPrice(option.price)})
        </option>
      ))}
    </select>
  </div>
)}   
 
                          
                          {/* Notes input */}
                          <div className="mb-4">
                            <label htmlFor={`notes-${item.id}`} className="block text-sm font-medium text-gray-500 mb-1">
                              Observações (opcional)
                            </label>
                            <input
                              id={`notes-${item.id}`}
                              type="text"
                              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                              placeholder="Ex: sem cebola, bem passado, etc."
                              value={itemNotes[item.id] || ''}
                              onChange={(e) => updateItemNotes(item.id, e.target.value)}
                            />
                          </div>

                          {/* Add to Cart Button */}
                          <motion.button
                            onClick={addToCartWithAnimation}
                            className={`mt-auto w-full bg-[#918e89] text-[#e6be44] font-bold py-3 rounded-lg flex items-center justify-center relative overflow-hidden`}
                            whileHover={{ 
                              y: -2,
                              boxShadow: '0 5px 15px rgba(0,0,0,0.1)'
                            }}
                            whileTap={{ scale: 0.98 }}
                          >
                            {isAdding ? (
                              <motion.span
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="flex items-center"
                              >
                                <FiCheck className="mr-2" />
                                Adicionado!
                              </motion.span>
                            ) : (
                              <motion.span
                                initial={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 20 }}
                                className="flex items-center"
                              >
                                <FiPlus className="mr-2" />
                                Adicionar
                              </motion.span>
                            )}
                            
                            {/* Animated background effect */}
                            {isAdding && (
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: '100%' }}
                                transition={{ duration: 1 }}
                                className="absolute bottom-0 left-0 h-1 bg-[#e6be44]"
                              />
                            )}
                          </motion.button>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {!isMobile && showCart && (
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30 }}
            className="w-1/3 border-l border-[#e6be44] bg-white shadow-lg flex flex-col"
          >
            <div className="bg-[#e6be44] text-white p-4 flex justify-between items-center">
              <h2 className="text-xl font-bold flex items-center">
                <FaShoppingCart className="h-5 w-5 mr-2" />
                Seu Pedido - Mesa {tableNumber}
              </h2>
              <button 
                onClick={() => setShowCart(false)}
                className="text-white hover:text-gray-200 transition-colors"
              >
                <IoMdClose className="h-6 w-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              {cart.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <FaShoppingCart className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>Seu carrinho está vazio</p>
                  <button
                    onClick={() => setShowCart(false)}
                    className="mt-4 px-4 py-2 bg-[#e6be44] text-white rounded-lg hover:bg-[#d5c8b6] shadow-md transition-colors"
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
                        className="flex justify-between items-start p-3 bg-[#f5f5f5] rounded-lg shadow-sm border border-[#e6be44]"
                      >
                        <div className="flex-grow">
                          <div className="font-bold text-black">{item.name}</div>
                          {item.description && (
                            <div className="text-xs text-gray-500 mt-1 line-clamp-1">{item.description}</div>
                          )}
                          {item.notes && (
                            <div className="text-xs text-gray-600 mt-1 bg-white px-2 py-1 rounded">
                              <span className="font-semibold">Obs:</span> {item.notes}
                            </div>
                          )}
                          <div className="flex items-center mt-3">
                            <button 
                              onClick={() => removeFromCart(item.cartId, item.id)}
                              className="bg-[#d5c8b6] hover:bg-[#b0aca6] p-1 rounded-full transition-colors"
                            >
                              <FaMinus className="h-3 w-3" />
                            </button>
                            <span className="mx-2 font-bold w-6 text-center">
                              {item.quantity || 1}
                            </span>
                            <button 
                              onClick={() => addToCart(item)}
                              className="bg-[#d5c8b6] hover:bg-[#b0aca6] p-1 rounded-full transition-colors"
                            >
                              <FaPlus className="h-3 w-3" />
                            </button>
                            <button
                              onClick={() => removeItemCompletely(item.cartId)}
                              className="ml-3 text-gray-500 hover:text-red-500 transition-colors"
                            >
                              <FaTrash className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                        <div className="font-bold text-black ml-4 whitespace-nowrap">
                          {formatPrice(item.price * (item.quantity || 1))}
                        </div>
                      </motion.div>
                    ))}
                  </div>


                  <div className="bg-white p-4 rounded-lg border border-[#e6be44] mb-6 shadow-sm">
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-700 font-bold">Subtotal:</span>
                      <span className="font-bold text-black">{formatPrice(calculateTotal())}</span>
                    </div>
                    <div className="border-t border-gray-200 my-2"></div>
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-black">Total:</span>
                      <span className="text-xl font-bold text-[#e6be44]">{formatPrice(calculateTotal())}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setShowConfirmation(true)}
                    disabled={isSendingOrder || cart.length === 0}
                    className={`w-full py-3 rounded-lg font-bold transition-all shadow-lg mb-4 ${
                      isSendingOrder || cart.length === 0
                        ? 'bg-gray-300 cursor-not-allowed'
                        : 'bg-gradient-to-r from-[#918e89] to-[#b0aca6] text-white'
                    }`}
                  >
                    <span className="flex items-center justify-center">
                      <FaReceipt className="h-5 w-5 mr-2" />
                      Finalizar Pedido
                    </span>
                  </button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </div>

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
        className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-[#e6be44] text-white p-4 flex justify-between items-center">
          <h2 className="text-xl font-bold flex items-center">
            <FaShoppingCart className="h-5 w-5 mr-2" />
            Seu Pedido - Mesa {tableNumber}
          </h2>
          <button 
            onClick={() => setShowCart(false)}
            className="text-white hover:text-gray-200 transition-colors"
          >
            <IoMdClose className="h-6 w-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {cart.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <FaShoppingCart className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>Seu carrinho está vazio</p>
              <button
                onClick={() => setShowCart(false)}
                className="mt-4 px-4 py-2 bg-[#e6be44] text-white rounded-lg hover:bg-[#d5c8b6] shadow-md transition-colors"
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
                    className="flex justify-between items-start p-3 bg-[#f5f5f5] rounded-lg shadow-sm border border-[#e6be44]"
                  >
                    <div className="flex-grow">
                      <div className="font-bold text-black flex justify-between">
                        <span>{item.name}</span>
                        <span className="font-bold text-[#e6be44]">
                          {formatPrice(item.price * (item.quantity || 1))}
                        </span>
                      </div>
                      {item.notes && (
                        <div className="text-xs text-gray-600 mt-1 bg-white px-2 py-1 rounded">
                          <span className="font-semibold">Obs:</span> {item.notes}
                        </div>
                      )}
                      <div className="flex items-center mt-3">
                        <button 
                          onClick={() => removeFromCart(item.cartId, item.id)}
                          className="bg-[#d5c8b6] hover:bg-[#b0aca6] p-1 rounded-full transition-colors"
                        >
                          <FaMinus className="h-3 w-3" />
                        </button>
                        <span className="mx-2 font-bold w-6 text-center">
                          {item.quantity || 1}
                        </span>
                        <button 
                          onClick={() => addToCart(item)}
                          className="bg-[#d5c8b6] hover:bg-[#b0aca6] p-1 rounded-full transition-colors"
                        >
                          <FaPlus className="h-3 w-3" />
                        </button>
                        <button
                          onClick={() => removeItemCompletely(item.cartId)}
                          className="ml-3 text-gray-500 hover:text-red-500 transition-colors"
                        >
                          <FaTrash className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="bg-white p-4 rounded-lg border border-[#e6be44] mb-6 shadow-sm">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-700 font-bold">Subtotal:</span>
                  <span className="font-bold text-black">{formatPrice(calculateTotal())}</span>
                </div>
                <div className="border-t border-gray-200 my-2"></div>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-black">Total:</span>
                  <span className="text-xl font-bold text-[#e6be44]">{formatPrice(calculateTotal())}</span>
                </div>
              </div>

              <button
                onClick={() => setShowConfirmation(true)}
                disabled={isSendingOrder || cart.length === 0}
                className={`w-full py-3 rounded-lg font-bold transition-all shadow-lg mb-4 ${
                  isSendingOrder || cart.length === 0
                    ? 'bg-gray-300 cursor-not-allowed'
                    : 'bg-gradient-to-r from-[#918e89] to-[#b0aca6] text-white'
                }`}
              >
                <span className="flex items-center justify-center">
                  <FaReceipt className="h-5 w-5 mr-2" />
                  Finalizar Pedido
                </span>
              </button>
            </>
          )}
        </div>
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>

      <AnimatePresence>
        {showConfirmation && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-hidden flex flex-col"
            >
              <div className="bg-[#e6be44] text-white p-4 flex justify-between items-center">
                <h2 className="text-xl font-bold flex items-center">
                  <FaCheck className="h-5 w-5 mr-2" />
                  Confirmação do Pedido
                </h2>
                <button 
                  onClick={() => setShowConfirmation(false)}
                  className="text-white hover:text-gray-200 transition-colors"
                >
                  <IoMdClose className="h-6 w-6" />
                </button>
              </div>

              <div className="p-4 overflow-y-auto flex-grow">
                <div className="text-center mb-4">
                  <h3 className="text-lg font-bold text-black">Mesa {tableNumber}</h3>
                  <p className="text-sm text-gray-600">Revise seu pedido antes de enviar</p>
                </div>

                <div className="space-y-3 mb-6 max-h-96 overflow-y-auto">
                  {cart.map(item => (
                    <div key={item.cartId} className="p-3 bg-[#f5f5f5] rounded-lg border border-[#e6be44]">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-bold text-black">
                            {item.name} × {item.quantity || 1}
                          </div>
                          {item.notes && (
                            <div className="text-xs text-gray-600 mt-1 bg-white px-2 py-1 rounded">
                              <span className="font-semibold">Obs:</span> {item.notes}
                            </div>
                          )}
                        </div>
                        <div className="font-bold text-black whitespace-nowrap">
                          {formatPrice(item.price * (item.quantity || 1))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>


                <div className="bg-white p-4 rounded-lg border border-[#e6be44] mb-6 shadow-sm">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-700 font-bold">Subtotal:</span>
                    <span className="font-bold text-black">{formatPrice(calculateTotal())}</span>
                  </div>
                  <div className="border-t border-gray-200 my-2"></div>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-black">Total:</span>
                    <span className="text-xl font-bold text-[#e6be44]">{formatPrice(calculateTotal())}</span>
                  </div>
                </div>
              </div>

              <div className="p-4 border-t border-gray-200">
                <button
                  onClick={sendOrder}
                  disabled={isSendingOrder}
                  className={`w-full py-3 rounded-lg font-bold transition-all shadow-lg ${
                    isSendingOrder
                      ? 'bg-gray-300 cursor-not-allowed'
                      : 'bg-gradient-to-r from-[#918e89] to-[#b0aca6] text-white'
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
                      <FaCheck className="h-5 w-5 mr-2" />
                      Confirmar e Enviar Pedido
                    </span>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Novo Footer */}
      <footer className="bg-[#918e89] text-white relative overflow-hidden">
        {/* Top image section */}
        <div className="w-full h-32 sm:h-40 md:h-48 lg:h-56 xl:h-64 -mt-px overflow-hidden">
          <img
            src={altoastralFoto}
            alt="Alto Astral"
            className="w-full h-full object-cover object-center"
            loading="lazy"
          />
        </div>

        <div className="container mx-auto px-4 sm:px-6 pb-6 sm:pb-8 md:pb-10 lg:pb-12">
          {/* Dynamic content slider for Events and Orders */}
          <div
            className="relative rounded-lg sm:rounded-xl md:rounded-2xl mb-8 sm:mb-10 md:mb-12 lg:mb-16 mx-0 shadow-lg sm:shadow-xl md:shadow-2xl overflow-hidden border border-[#b8b4ae]/20"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#7a6d5d]/90 to-[#5a5148]/90 z-0"></div>

            <div className="absolute inset-0 overflow-hidden z-0">
              <AnimatePresence mode="wait">
                <motion.div
                  key={events[activeEvent].id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.5 }}
                  className="absolute inset-0"
                >
                  <img
                    src={events[activeEvent].image}
                    alt={events[activeEvent].title}
                    className="w-full h-full object-cover object-center"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/40"></div>
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="relative z-10 p-4 sm:p-6 md:p-8 lg:p-10 xl:p-12">
              <div className="flex flex-col lg:flex-row items-start justify-between gap-4 sm:gap-6 md:gap-8">
                <div className="flex-1 space-y-4 sm:space-y-6">
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 1 }}
                  >
                    <div className="inline-flex items-center text-[#d5c8b6] px-3 py-1 sm:px-4 sm:py-2 rounded-full border border-[#d5c8b6]/50 mb-2 sm:mb-3 md:mb-4">
                      <FiCalendar className="text-lg sm:text-xl text-[#d5c8b6] mr-2" />
                      <span className="font-sans-serif text-[#d5c8b6] text-sm sm:text-base font-medium">Eventos Exclusivos</span>
                    </div>
                  </motion.div>

                  <AnimatePresence mode="wait">
                    <motion.div
                      key={`title-${events[activeEvent].id}`}
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -20, opacity: 0 }}
                      transition={{ duration: 1.2 }}
                    >
                      <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold font-sans-serif text-[#fffaf1] leading-tight">
                        {events[activeEvent].title}
                      </h3>
                    </motion.div>
                  </AnimatePresence>

                  <AnimatePresence mode="wait">
                    <motion.div
                      key={`desc-${events[activeEvent].id}`}
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -20, opacity: 0 }}
                      transition={{ duration: 1.4, delay: 0.2 }}
                    >
                      <p className="text-base sm:text-lg md:text-xl text-[#fffaf1] mt-1 sm:mt-2 md:mt-3 lg:mt-4 max-w-2xl">
                        {events[activeEvent].description}
                      </p>
                    </motion.div>
                  </AnimatePresence>

                  <div className="mt-4 sm:mt-5 md:mt-6 grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                    <AnimatePresence>
                      {events[activeEvent].features.map((feature, index) => (
                        <motion.div
                          key={`feature-${events[activeEvent].id}-${index}`}
                          initial={{ x: -20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ duration: 0.8, delay: 0.4 + index * 0.2 }}
                          className="flex items-start sm:items-center"
                        >
                          <div className="bg-[#d5c8b6]/40 p-1 rounded-full mr-2 sm:mr-3 mt-0.5 sm:mt-0">
                            <FiCheck className="text-[#d5c8b6] text-xs sm:text-sm" />
                          </div>
                          <span className="text-[#fffaf1] text-xs sm:text-sm md:text-base">{feature}</span>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </div>

                <div className="w-full lg:w-auto flex flex-col items-start lg:items-end space-y-4 sm:space-y-5 md:space-y-6 mt-4 sm:mt-0">
                  <div className="flex space-x-2 self-center lg:self-auto">
                    {events.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setActiveEvent(index)}
                        className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all ${activeEvent === index ? 'bg-[#d5c8b6] w-4 sm:w-6' : 'bg-white/30'}`}
                        aria-label={`Mostrar evento ${index + 1}`}
                      />
                    ))}
                  </div>

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    className="w-full sm:w-auto"
                  >
                    <a
                      href="https://wa.me/351282038830?text=Ol%C3%A1%2C%20gostaria%20de%20obter%20mais%20informa%C3%A7%C3%B5es%20sobre%20os%20eventos."
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-[#d5c8b6] text-black px-6 sm:px-8 md:px-10 py-3 sm:py-4 md:py-5 rounded-lg sm:rounded-xl font-bold flex items-center justify-center sm:justify-start transition-all duration-300 shadow-md sm:shadow-lg group w-full"
                    >
                      <span className="font-sans-serif text-sm sm:text-base md:text-lg mr-2 sm:mr-3">Saber Mais sobre Eventos</span>
                      <FiArrowRight className="text-black transition-transform group-hover:translate-x-1" />
                    </a>
                  </motion.div>
                  <p className="font-sans-serif text-[#fffaf1]/80 text-xs sm:text-sm md:text-base text-center lg:text-right">
                    Entre em contato para orçamentos personalizados
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Main footer content */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 md:gap-10 lg:gap-12 text-[#fffaf1] px-2 sm:px-0">
            {/* Brand info */}
            <div className="space-y-4 sm:space-y-5 md:space-y-6 lg:space-y-8 order-1">
              <div className="text-center sm:text-left">
                <h3 className="font-sans-serif text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-[#fffaf1]">Alto Astral</h3>
                <p className="font-sans-serif text-[#d1cfcc] text-sm sm:text-base md:text-lg mt-1 sm:mt-2">Experiências Gastronômicas Memoráveis</p>
              </div>

              <div className="space-y-3 sm:space-y-4 md:space-y-5">
                <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-2 sm:gap-3">
                  <div className="bg-[#f4df86]/20 p-1.5 sm:p-2 rounded-lg flex-shrink-0">
                    <FiMapPin className="text-lg sm:text-xl text-[#f4df86]" />
                  </div>
                  <a
                    href="https://www.google.com/maps/place/Rua+Agostinho+Da+Silva+Lote+20,+Loja+2,+8500-826+Portim%C3%A3o,+Portugal"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-sans-serif text-[#fffaf1] text-sm sm:text-base leading-relaxed hover:text-white transition-colors"
                  >
                    Rua Agostinho Da Silva Lote 20, Loja 2<br />
                    8500-826 Portimão, Portugal<br />
                    Urb. Horta De São Pedro
                  </a>
                </div>
                <div className="flex items-center justify-center sm:justify-start gap-2 sm:gap-3">
                  <div className="bg-[#f4df86]/20 p-1.5 sm:p-2 rounded-lg">
                    <FiPhone className="text-lg sm:text-xl text-[#f4df86]" />
                  </div>
                  <a href="tel:+351282038830" className="hover:text-white transition-colors text-sm sm:text-base md:text-lg">(+351) 282 038 830</a>
                </div>
              </div>
            </div>

            {/* Opening hours */}
            <div className="flex justify-center order-3 lg:order-2">
              <div className="bg-[#a09b94]/90 border border-[#b8b4ae]/30 rounded-lg sm:rounded-xl md:rounded-2xl p-4 sm:p-5 md:p-6 lg:p-8 w-full max-w-xs sm:max-w-sm shadow-lg sm:shadow-xl">
                <div className="bg-[#f4df86]/20 w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 rounded-lg sm:rounded-xl md:rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 md:mb-5 lg:mb-6 border border-[#f4df86]/30">
                  <FiClock className="text-xl sm:text-2xl md:text-3xl text-[#f4df86]" />
                </div>
                <h4 className="text-lg sm:text-xl md:text-2xl font-sans-serif font-semibold mb-2 sm:mb-3 md:mb-4 text-center text-[#f8f5f0]">Horário</h4>
                <div className="text-center space-y-1 sm:space-y-2">
                  <p className="font-sans-serif font-medium text-sm sm:text-base md:text-lg">8:30 - 20:00</p>
                  <p className="font-sans-serif text-[#d1cfcc] text-xs sm:text-sm md:text-base">Segunda a Sábado</p>
                </div>
              </div>
            </div>

            {/* Social media and Admin Login */}
            <div className="space-y-4 sm:space-y-5 md:space-y-6 lg:space-y-8 order-2 lg:order-3">
              <h4 className="text-base sm:text-lg md:text-xl font-semibold uppercase tracking-wider border-b border-[#b8b4ae]/40 pb-2 sm:pb-3 text-center sm:text-left text-[#fffaf1]">Conecte-se</h4>
              <div className="flex justify-center sm:justify-start gap-3 sm:gap-4 md:gap-5">
                <motion.a
                  href="https://www.instagram.com/altoastralsnackbar?igsh=MXUzMHVmamx6MDFvbA=="
                  whileHover={{ y: -3 }}
                  className="bg-gradient-to-br from-[#f09433] to-[#bc1888] w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-md sm:rounded-lg md:rounded-xl flex items-center justify-center text-white shadow-md sm:shadow-lg hover:shadow-xl transition-all"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FiInstagram className="text-lg sm:text-xl md:text-2xl" />
                </motion.a>

                <motion.a
                  href="https://www.facebook.com/p/Alto-Astral-Snack-Bar-100083351294242/"
                  whileHover={{ y: -3 }}
                  className="bg-[#3b5998] w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-md sm:rounded-lg md:rounded-xl flex items-center justify-center text-white shadow-md sm:shadow-lg hover:shadow-xl transition-all"
                  target='_blank'
                  rel="noopener noreferrer"
                >
                  <FiFacebook className="text-lg sm:text-xl md:text-2xl" />
                </motion.a>
              </div>
            </div>
          </div>

          {/* Bottom footer */}
          <div className="border-t border-[#b8b4ae]/30 mt-8 sm:mt-10 md:mt-12 lg:mt-14 xl:mt-16 pt-4 sm:pt-5 md:pt-6 lg:pt-7 xl:pt-8">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-3 md:gap-4">
              <p className="text-[#d1cfcc] text-xs sm:text-sm md:text-base text-center sm:text-left">
                © {new Date().getFullYear()} <span className="text-[#fffaf1]">Alto Astral</span>. Todos os direitos reservados.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ClientInterface;