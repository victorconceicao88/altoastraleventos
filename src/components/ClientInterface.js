import { useState, useEffect, useCallback, useRef } from 'react';
import { onValue, push, update, ref, set, get, remove } from 'firebase/database';
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
  FaSnowflake
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
    
    setCart(prevCart => {
      const existingItem = prevCart.find(cartItem => 
        cartItem.id === finalItem.id && 
        cartItem.notes === finalItem.notes
      );
      
      if (existingItem) {
        return prevCart.map(cartItem =>
          cartItem.id === finalItem.id && cartItem.notes === finalItem.notes
            ? { ...cartItem, quantity: (cartItem.quantity || 1) + 1 } 
            : cartItem
        );
      } else {
        return [...prevCart, { 
          ...finalItem, 
          quantity: 1, 
          cartId: Date.now(),
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
      const orderItems = cart.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        description: item.description || '',
        quantity: item.quantity || 1,
        notes: item.notes || '',
        addedAt: Date.now()
      }));

      const orderTotal = cart.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);

      const orderData = {
        items: orderItems,
        status: 'Recebido',
        createdAt: Date.now(),
        tableNumber: parseInt(tableNumber),
        source: 'client',
        total: orderTotal,
        notes: orderNotes,
        clientNotes: orderNotes,
        itemNotes: orderItems.reduce((acc, item) => {
          if (item.notes) {
            acc[item.id] = item.notes;
          }
          return acc;
        }, {})
      };

      const orderRef = currentOrderId 
        ? ref(database, `tables/${tableNumber}/currentOrder/${currentOrderId}`)
        : ref(database, `tables/${tableNumber}/currentOrder`);

      if (currentOrderId) {
        const updates = {
          items: [...(activeOrder?.items || []), ...orderItems],
          updatedAt: Date.now(),
          status: 'Recebido',
          total: (activeOrder?.total || 0) + orderTotal,
          notes: orderNotes,
          clientNotes: orderNotes,
          itemNotes: {
            ...(activeOrder?.itemNotes || {}),
            ...orderData.itemNotes
          }
        };
        
        await update(orderRef, updates);
      } else {
        const newOrderRef = await push(orderRef);
        await set(newOrderRef, orderData);
        setCurrentOrderId(newOrderRef.key);
      }

      setCart([]);
      setOrderStatus('Pedido enviado');
      setShowConfirmation(false);
      setOrderNotes('');
      setIsSendingOrder(false);
      
      setTimeout(() => {
        if (isMobile) setShowCart(false);
        setOrderStatus('');
      }, 3000);

    } catch (error) {
      console.error("Erro ao enviar pedido:", error);
      setOrderStatus('Erro ao enviar');
      setIsSendingOrder(false);
      setTimeout(() => setOrderStatus(''), 2000);
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
        available: dailySpecialId === 1
      },
      { 
        id: 2, 
        name: 'Maminha Top', 
        description: 'Maminha grelhada, arroz branco, feijão tropeiro e vinagrete', 
        price: 15.90, 
        veg: false, 
        image: 'picanhaPremium', 
        rating: 4.8,
        available: dailySpecialId === 2
      },
      { 
        id: 3, 
        name: 'Costela Raiz', 
        description: 'Costela de vaca com mandioca, arroz branco, farofa e salada', 
        price: 14.90, 
        veg: false, 
        image: 'costelaRaiz', 
        rating: 4.7,
        available: dailySpecialId === 3
      },
      { 
        id: 4, 
        name: 'Frango Supremo', 
        description: 'Filé de frango à parmegiana, arroz branco, batata frita e salada', 
        price: 13.90, 
        veg: false, 
        image: 'frangosupremo', 
        rating: 4.3,
        available: dailySpecialId === 4
      },
      { 
        id: 5, 
        name: 'Feijoada Astral', 
        description: 'Feijoada brasileira, arroz branco, couve, farofa, torresmo e laranja', 
        price: 12.90, 
        veg: false, 
        image: 'feijoadaAstral', 
        rating: 4.9,
        available: dailySpecialId === 5
      },
      { 
        id: 6, 
        name: 'Opção Vegetariana', 
        description: 'Prato vegetariano sob consulta - acompanha bebida e café', 
        price: 12.90, 
        veg: true, 
        image: 'vegano', 
        rating: 4.2,
        available: true // Sempre disponível
      }
    ],
    lanches: [
      { id: 7, name: 'Hambúrguer com Fritas', description: 'Carne, alface, tomate, cebola, cheddar, molho da casa', price: 7.00, image: 'hamburguer', rating: 4.4 },
      { id: 8, name: 'Hambúrguer Alto Astral', description: 'Carne 120g, bacon, queijo, anéis de cebola, alface, tomate, cheddar, molho coquetel e especial', price: 9.90, image: 'hamburgueraltoastral', rating: 4.7 },
      { id: 9, name: 'Hambúrguer Neg\'s', description: 'Carne 120g, frango panado, bacon, queijo, anéis de cebola, cebola crispy, alface, tomate, cheddar, molho coquetel e especial', price: 12.90, image: 'negs', rating: 4.9 },
      { id: 10, name: 'Sandes de Panado', description: 'Frango panado, alface, tomate, cebola, molho da casa', price: 5.50, image: 'sandespanado', rating: 4.1 },
      { id: 11, name: 'Tostas Premium (Frango)', description: 'acompanha queijo, alface, tomate e cebola roxa', price: 6.50, image: 'tostaspremium', rating: 4.0 },
      { id: 12, name: 'Tostas Premium (Atum)', description: 'acompanha queijo, alface, tomate e cebola roxa', price: 6.50, image: 'tostaspremium', rating: 4.0 },
      { id: 13, name: 'Sanduíche Natural', description: 'Patê de frango, queijo, rúcula, tomate, cebola roxa e cenoura ralada', price: 6.50, image: 'sanduichenatural', rating: 3.9 }
    ],
    porcoes: [
      { id: 14, name: 'Batata Frita', description: 'Porção com 400g de batata frita', price: 4.00, image: 'batataFrita', rating: 4.2 },
      { id: 15, name: 'Fritas com Bacon e Queijo', description: 'Porção com 400g de batatas com bacon e queijo cheddar', price: 6.50, image: 'fritascomqueijo', rating: 4.6 },
      { id: 16, name: 'Chouriça com Cebola', description: 'Porção com 600g de chouriça acebolada e pão fatiado', price: 9.00, image: 'chorica', rating: 4.5 },
      { id: 17, name: 'Asinha de Frango', description: 'Porção com 700g de asinhas de frango e molho barbecue', price: 12.00, image: 'Asinha', rating: 4.4 },
      { id: 18, name: 'Costelinha', description: 'Porção com 800g de costelinha e molho barbecue', price: 12.00, image: 'costelaporco', rating: 4.7 },
      { id: 19, name: 'Picanha com Fritas', description: 'Porção com 600g de tiras de picanha temperada com sal de parrilha e acompanhado de batata frita ou doce', price: 22.90, image: 'Picanhacomfritas', rating: 4.8 },
      { id: 20, name: 'Filé de Tilápia', description: 'Porção com 800g de filé de tilápia e molho tartaro', price: 15.00, image: 'Filetilapia', rating: 4.3 }
    ],
    pasteis: [
      { id: 21, name: 'Pastel Simples', description: 'Frango desfiado, carne picada ou queijo', price: 5.00, image: 'pastelfeira', rating: 4.3 },
      { id: 22, name: 'Pastel de Frango com Queijo', description: 'Frango desfiado com queijo', price: 5.50, image: 'pastelfeira', rating: 4.5 },
      { id: 23, name: 'Pastel de Frango com Queijo e Bacon', description: 'Frango desfiado com queijo e bacon em cubos', price: 6.50, image: 'pastelfeira', rating: 4.7 },
      { id: 24, name: 'Pastel de Carne com Queijo', description: 'Carne picada com queijo e azeitona', price: 5.50, image: 'pastelfeira', rating: 4.4 },
      { id: 25, name: 'Pastel de Carne com Queijo e Bacon', description: 'Carne picada com queijo, azeitona e bacon em cubos', price: 6.50, image: 'pastelfeira', rating: 4.6 },
      { id: 26, name: 'Pastel de Chouriça', description: 'Queijo, chouriça e milho', price: 5.50, image: 'pastelfeira', rating: 4.2 },
      { id: 27, name: 'Pastel Misto', description: 'Fiambre, queijo, azeitona e milho', price: 5.50, image: 'pastelfeira', rating: 4.1 },
      { id: 28, name: 'Pastel de Pizza', description: 'Queijo, fiambre, tomate e orégano', price: 5.50, image: 'pastelfeira', rating: 4.0 },
      { id: 29, name: 'Pastel Alto Astral', description: 'Queijo, bacon, tomate, azeitona, cheddar e orégano', price: 6.50, image: 'pastelfeira', rating: 4.8 },
      { id: 30, name: 'Pastel Romeu e Julieta', description: 'Queijo com goiabada', price: 5.50, image: 'pastelfeira', rating: 4.7 },
      { id: 31, name: 'Pastel de Banana com Nutella', description: 'Queijo, banana e nutella', price: 6.00, image: 'pastelfeira', rating: 4.9 }
    ],
    cafe: [
      { id: 32, name: 'Café Expresso', price: 1.00, image: 'cafe', rating: 4.5 },
      { id: 33, name: 'Café Descafeinado', price: 1.00, image: 'cafe', rating: 4.3 },
      { id: 34, name: 'Café Duplo', price: 2.00, image: 'pastel', rating: 4.6 },
      { id: 35, name: 'Garoto', price: 1.00, image: 'Garoto', rating: 4.2 },
      { id: 36, name: 'Abatanado', price: 1.10, image: 'abatanado', rating: 4.1 },
      { id: 37, name: 'Meia de Leite', price: 1.50, image: 'meialeite', rating: 4.4 },
      { id: 38, name: 'Galão', price: 1.60, image: 'galao', rating: 4.5 },
      { id: 39, name: 'Chá', price: 1.60, image: 'cha', rating: 4.0 },
      { id: 40, name: 'Cappuccino', price: 3.00, image: 'capuccino', rating: 4.7 },
      { id: 41, name: 'Carioca de Limão', price: 1.00, image: 'cariocalimao', rating: 3.9 },
      { id: 42, name: 'Chocolate Quente', price: 3.00, image: 'chocolatequente', rating: 4.8 },
      { id: 43, name: 'Torrada com Pão Caseiro', price: 2.00, image: 'torradapaocaseiro', rating: 4.3 },
      { id: 44, name: 'Torrada com Pão de Forma', price: 1.50, image: 'torradapaodeforma', rating: 4.1 },
      { id: 45, name: 'Meia Torrada', price: 1.00, image: 'torradapaocaseiro', rating: 4.0 },
      { id: 46, name: 'Croissant Misto', price: 3.00, image: 'croissanmisto', rating: 4.6 },
      { id: 47, name: 'Croissant Misto Tostado', price: 3.20, image: 'croissant', rating: 4.7 },
      { id: 48, name: 'Tosta Mista', price: 3.20, image: 'tosta', rating: 4.5 },
      { id: 49, name: 'Tosta Mista (Pão de Forma)', price: 2.80, image: 'tostamistapaoforma', rating: 4.4 },
      { id: 50, name: 'Sandes Mista', price: 2.20, image: 'sandesmista', rating: 4.2 },
      { id: 51, name: 'Pão com Ovo', price: 2.20, image: 'paocomovo', rating: 4.1 },
      { id: 52, name: 'Ovos com Bacon', price: 4.00, image: 'ovosebacaon', rating: 4.7 }
    ],
    bebidas: [
      { id: 53, name: 'Caipirinha', description: 'Cachaça 51 ou Velho Barreiro, lima, açúcar e gelo', price: 6.00, image: 'caipirinha', rating: 4.8 },
      { id: 54, name: 'Caipiblack', description: 'Cachaça preta, lima, açúcar e gelo', price: 6.00, image: 'Caipiblack', rating: 4.9 },
      { id: 55, name: 'Whiskey Jamenson', price: 3.50, image: 'bebida', rating: 4.7 },
      { id: 56, name: 'Whiskey J&B', price: 3.00, image: 'bebida', rating: 4.5 },
      { id: 57, name: 'Whiskey Jack Daniels', price: 3.50, image: 'bebida', rating: 4.8 },
      { id: 58, name: 'Whiskey Black Label', price: 4.00, image: 'bebida', rating: 4.9 },
      { id: 59, name: 'Vodka', price: 4.00, image: 'vodka', rating: 4.6 }
    ],
    sumos: [
      {
        id: 'sumo-maracuja',
        name: 'Sumo/Batido de Maracujá',
        description: 'Rico em vitamina C e antioxidantes, ajuda a reduzir a ansiedade e melhorar a qualidade do sono',
        price: 4.00,
        baseOptions: {
          agua: 4.00,
          leite: 4.50
        },
        image: 'maracuja',
        veg: true,
        nutritionalInfo: 'Alto teor de vitamina A, C, ferro e fibras. 120kcal (com água)'
      },
      {
        id: 'sumo-acerola',
        name: 'Sumo/Batido de Acerola',
        description: 'Uma das maiores fontes naturais de vitamina C, fortalece o sistema imunológico',
        price: 4.00,
        baseOptions: {
          agua: 4.00,
          leite: 4.50
        },
        image: 'acerola',
        veg: true,
        nutritionalInfo: 'Contém 30x mais vitamina C que a laranja. 110kcal (com água)'
      },
      {
        id: 'sumo-manga',
        name: 'Sumo/Batido de Manga',
        description: 'Doce e nutritivo, rico em vitamina A que beneficia a saúde ocular e da pele',
        price: 4.00,
        baseOptions: {
          agua: 4.00,
          leite: 4.50
        },
        image: 'manga',
        veg: true,
        nutritionalInfo: 'Fonte de vitamina A, C e fibras. 150kcal (com água)'
      },
      {
        id: 'sumo-goiaba',
        name: 'Sumo/Batido de Goiaba',
        description: 'Excelente fonte de licopeno e vitamina C, auxilia na saúde cardiovascular',
        price: 4.00,
        baseOptions: {
          agua: 4.00,
          leite: 4.50
        },
        image: 'goiaba',
        veg: true,
        nutritionalInfo: 'Rica em antioxidantes e fibras. 130kcal (com água)'
      },
      {
        id: 'sumo-morango',
        name: 'Sumo/Batido de Morango',
        description: 'Delicioso e rico em antioxidantes que combatem os radicais livres',
        price: 4.00,
        baseOptions: {
          agua: 4.00,
          leite: 4.50
        },
        image: 'morango',
        veg: true,
        nutritionalInfo: 'Contém manganês, potássio e vitamina C. 100kcal (com água)'
      },
      {
        id: 'sumo-caju',
        name: 'Sumo/Batido de Caju',
        description: 'Refrescante e rico em zinco, importante para a imunidade e saúde da pele',
        price: 4.00,
        baseOptions: {
          agua: 4.00,
          leite: 4.50
        },
        image: 'Caju',
        veg: true,
        nutritionalInfo: 'Fonte de vitamina C e minerais. 140kcal (com água)'
      },
      {
        id: 'sumo-abacaxi',
        name: 'Sumo/Batido de Abacaxi',
        description: 'Contém bromelina, enzima que auxilia na digestão e reduz inflamações',
        price: 4.00,
        baseOptions: {
          agua: 4.00,
          leite: 4.50
        },
        image: 'abacaxi',
        veg: true,
        nutritionalInfo: 'Diurético natural e rico em vitamina C. 120kcal (com água)'
      },
      {
        id: 'sumo-coco',
        name: 'Sumo/Batido de Coco',
        description: 'Hidratante natural, rico em eletrólitos e gorduras saudáveis',
        price: 4.00,
        baseOptions: {
          agua: 4.00,
          leite: 4.50
        },
        image: 'coco',
        veg: true,
        nutritionalInfo: 'Fonte de minerais e ácidos graxos. 180kcal (com água)'
      },
      {
        id: 'sumo-caja',
        name: 'Sumo/Batido de Cajá',
        description: 'Exótico e refrescante, rico em vitaminas do complexo B',
        price: 4.00,
        baseOptions: {
          agua: 4.00,
          leite: 4.50
        },
        image: 'caja',
        veg: true,
        nutritionalInfo: 'Contém cálcio, fósforo e ferro. 130kcal (com água)'
      },
      {
        id: 'sumo-cupuacu',
        name: 'Sumo/Batido de Cupuaçu',
        description: 'Sabor único e cremoso, rico em antioxidantes e vitamina A',
        price: 4.00,
        baseOptions: {
          agua: 4.00,
          leite: 4.50
        },
        image: 'cupuacu',
        veg: true,
        nutritionalInfo: 'Fonte de teobromina e ácidos graxos. 160kcal (com água)'
      },
      {
        id: 'sumo-graviola',
        name: 'Sumo/Batido de Graviola',
        description: 'Sabor tropical marcante, com propriedades que auxiliam no relaxamento',
        price: 4.00,
        baseOptions: {
          agua: 4.00,
          leite: 4.50
        },
        image: 'graviola',
        veg: true,
        nutritionalInfo: 'Rica em vitaminas B1, B2 e C. 140kcal (com água)'
      }
    ],
    'refrigerantes-aguas': [
      { 
        id: 66, 
        name: 'Refrigerante Lata', 
        description: 'Coca-Cola, Fanta, Sprite, Ice Tea, 7UP, Pepsi', 
        price: 1.60, 
        image: 'refrigerantes', 
        rating: 4.1
      },
      { 
        id: 67, 
        name: 'Água 1.5L', 
        description: 'Água mineral natural 1.5 litros', 
        price: 1.50, 
        image: 'agua', 
        rating: 4.0
      },
      { 
        id: 68, 
        name: 'Água 0.5L', 
        description: 'Água mineral natural 500ml', 
        price: 1.00, 
        image: 'agua', 
        rating: 4.0
      },
      { 
        id: 69, 
        name: 'Água 0.33L', 
        description: 'Água mineral natural 330ml', 
        price: 0.60, 
        image: 'agua', 
        rating: 4.0
      },
      { 
        id: 70, 
        name: 'Água Castelo', 
        description: 'Água mineral gaseificada 1L', 
        price: 1.40, 
        image: 'Castelo', 
        rating: 4.2 
      },
      { 
        id: 71, 
        name: 'Água das Pedras', 
        description: 'Água mineral gaseificada 1L', 
        price: 1.40, 
        image: 'pedras', 
        rating: 4.3 
      },
    ],
    salgados: [
      { id: 73, name: 'Pão de Queijo', price: 1.60, image: 'paodequeijo', rating: 4.5 },
      { id: 74, name: 'Pastel de Nata', price: 1.30, image: 'pasteldenata', rating: 4.7 },
      { id: 75, name: 'Empada de Frango', price: 2.00, image: 'empadafrango', rating: 4.4 },
      { id: 76, name: 'Kibe', price: 2.20, image: 'kibe', rating: 4.3 },
      { id: 77, name: 'Enroladinho de Salsicha e Queijo', price: 2.20, image: 'fiambre', rating: 4.2 },
      { id: 78, name: 'Fiambre e Queijo', price: 2.20, image: 'fiambreequeijo', rating: 4.2 },
      { id: 79, name: 'Bauru', price: 2.20, image: 'bauru', rating: 4.1 },
      { id: 80, name: 'Bola de Queijo', price: 2.20, image: 'bolaqueijo', rating: 4.3 },
      { id: 81, name: 'Coxinha de Frango', price: 2.20, image: 'Coxinha', rating: 4.6 },
      { id: 82, name: 'Coxinha com Catupiry', price: 3.00, image: 'Coxinha', rating: 4.8 },
      { id: 83, name: 'Hamburgão', price: 3.50, image: 'hamburgao', rating: 4.7 }
    ],
    sobremesas: [
      { id: 84, name: 'Bolo no Pote - Prestígio', description: 'Chocolate com coco', price: 4.00, image: 'Prestígio', rating: 4.8 },
      { id: 85, name: 'Bolo no Pote - Chocolate', description: 'Massa de chocolate com recheio de chocolate', price: 4.00, image: 'doces', rating: 4.9 },
      { id: 86, name: 'Bolo no Pote - Ananás', description: 'Creme de ninho com pedaços de ananás', price: 4.00, image: 'bolopoteananas', rating: 4.7 },
      { id: 87, name: 'Bolo no Pote - Choco Misto', description: 'Chocolate preto com ninho', price: 4.00, image: 'doces', rating: 4.8 },
      { id: 88, name: 'Cheesecake - Goiabada', price: 3.50, image: 'Cheesecake', rating: 4.7 },
      { id: 89, name: 'Cheesecake - Frutos Vermelhos', price: 3.50, image: 'frutosvermelhos', rating: 4.8 },
      { id: 90, name: 'Brigadeiro Tradicional', price: 1.50, image: 'doces', rating: 4.6 },
      { id: 91, name: 'Brigadeiro Beijinho', price: 1.50, image: 'doces', rating: 4.5 },
      { id: 92, name: 'Brigadeiro Ninho', price: 2.00, image: 'doces', rating: 4.8 },
      { id: 93, name: 'Brigadeiro Paçoca', price: 2.00, image: 'doces', rating: 4.7 },
      { id: 94, name: 'Brigadeiro Morango', price: 2.00, image: 'doces', rating: 4.8 },
      { id: 95, name: 'Brigadeiro Churros', price: 2.00, image: 'doces', rating: 4.9 },
      { id: 96, name: 'Tarte de Toblerone', price: 2.20, image: 'toblerone', rating: 4.7 },
      { id: 97, name: 'Bolo de Brigadeiro (fatia)', price: 2.20, image: 'doces', rating: 4.8 }
    ]
  };

  return (
    <div className="min-h-screen bg-white text-gray-800 flex flex-col">
      {/* Header */}
      <header className="bg-[#d5c8b6] shadow-lg sticky top-0 z-50 pt-safe-top">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg shadow-md">
                <img src={logo} alt="Logo Alto Astral" className="h-8 w-8" />
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
                className="relative p-3 bg-[#918e89] text-white rounded-full shadow-lg hover:bg-[#b0aca6] transition-colors flex items-center"
              >
                <FaCartPlus className="h-6 w-6" />
                {cart.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
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
            <div className="pb-3">
              <div className={`text-sm p-2 rounded font-medium text-center ${
                orderStatus.includes('Erro') ? 'bg-red-500' : 'bg-[#e6be44]'
              }`}>
                {orderStatus}
              </div>
            </div>
          )}

          {showItemAdded && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-20 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center"
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

            {activeCategory === 'sumos' ? (
              <div className="space-y-12">
                {/* Minimalist Hero Section */}
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

                {/* Product Grid with Individual State */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredMenu(activeCategory).map((item) => {
                    // Use item.id as part of the state key for individual control
                    const baseSelected = selectedBases[item.id] || 'agua';

                    const basePrice = baseSelected === 'leite' 
                      ? (item.baseOptions?.leite || item.price)
                      : (item.baseOptions?.agua || item.price);

                    const addToCartWithAnimation = () => {
                      setIsAdding(true);
                      addToCart({
                        ...item,
                        price: basePrice,
                        notes: `Base: ${baseSelected === 'agua' ? 'Água' : 'Leite'}`
                      }, baseSelected); // Passando a base selecionada como segundo parâmetro
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
                              {formatPrice(basePrice)}
                            </motion.div>
                          </div>
                          
                          <p className="text-gray-600 mb-4 flex-grow">{item.description}</p>
                          
                          {/* Base Selection - Individual to each product */}
                          <div className="mb-4">
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-sm font-medium text-gray-500">Base:</span>
                              <div className="flex items-center space-x-2">
                                <motion.button
                                  onClick={() => setSelectedBases(prev => ({ ...prev, [item.id]: 'agua' }))}
                                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                                    selectedBases[item.id] === 'agua' 
                                      ? 'bg-[#e6be44] text-white' 
                                      : 'bg-[#f3f3f3] text-gray-700'
                                  }`}
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                >
                                  Água
                                </motion.button>

                                <motion.button
                                  onClick={() => setSelectedBases(prev => ({ ...prev, [item.id]: 'leite' }))}
                                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                                    selectedBases[item.id] === 'leite' 
                                      ? 'bg-[#e6be44] text-white' 
                                      : 'bg-[#f3f3f3] text-gray-700'
                                  }`}
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                >
                                  Leite
                                </motion.button>
                              </div>
                            </div>
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
                      addToCart(item);
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
                          
                          <p className="text-gray-600 mb-4 flex-grow">{item.description}</p>
                          
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
                      {activeCategory === 'semana' ? 'Cardápio' : 
                       activeCategory === 'lanches' ? 'Lanches' : 
                       activeCategory === 'porcoes' ? 'Porções' : 
                       activeCategory === 'pasteis' ? 'Pastéis' : 
                       activeCategory === 'cafe' ? 'Café' : 
                       activeCategory === 'bebidas' ? 'Bebidas' : 
                       activeCategory === 'salgados' ? 'Salgados' : 
                       'Sobremesas'}
                    </span>
                  </h1>
                  <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                    {activeCategory === 'semana' ? 'Pratos deliciosos preparados com ingredientes frescos e selecionados' : 
                     activeCategory === 'lanches' ? 'Sanduíches e lanches para todos os gostos' : 
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
                      addToCart(item);
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

                  <div className="mb-4">
                    <label htmlFor="orderNotes" className="block text-sm font-bold text-black mb-1">
                      Observações para o pedido (opcional)
                    </label>
                    <textarea
                      id="orderNotes"
                      rows={3}
                      className="w-full px-3 py-2 border border-[#b0aca6] rounded-md focus:outline-none focus:ring-2 focus:ring-[#e6be44] text-sm"
                      placeholder="Ex: Sem cebola, bem passado, etc."
                      value={orderNotes}
                      onChange={(e) => setOrderNotes(e.target.value)}
                    />
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

                    <div className="mb-4">
                      <label htmlFor="mobileOrderNotes" className="block text-sm font-bold text-black mb-1">
                        Observações para o pedido (opcional)
                      </label>
                      <textarea
                        id="mobileOrderNotes"
                        rows={2}
                        className="w-full px-3 py-2 border border-[#b0aca6] rounded-md focus:outline-none focus:ring-2 focus:ring-[#e6be44] text-sm"
                        placeholder="Ex: Sem cebola, bem passado, etc."
                        value={orderNotes}
                        onChange={(e) => setOrderNotes(e.target.value)}
                      />
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

                <div className="mb-4">
                  <label htmlFor="confirmationNotes" className="block text-sm font-bold text-black mb-1">
                    Observações finais (opcional)
                  </label>
                  <textarea
                    id="confirmationNotes"
                    rows={2}
                    className="w-full px-3 py-2 border border-[#b0aca6] rounded-md focus:outline-none focus:ring-2 focus:ring-[#e6be44] text-sm"
                    placeholder="Ex: Sem cebola, bem passado, etc."
                    value={orderNotes}
                    onChange={(e) => setOrderNotes(e.target.value)}
                  />
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