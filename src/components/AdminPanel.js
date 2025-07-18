import { useState, useEffect, useRef, useCallback } from 'react';
import { ref, onValue, update, push, remove, set, get } from 'firebase/database';
import { database } from '../firebase';
import { signInWithEmailAndPassword, getAuth } from 'firebase/auth';

// Importações de imagens
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
import pedrassabor from '../assets/pedrassabor.jpg';
import superbock from '../assets/superbock.jpg';
import compal from '../assets/compal.jpg';
import energetico from '../assets/energetico.jpg';
import happyhour from '../assets/happyhour.jpg';

let globalPrinterDevice = null;
let globalPrinterCharacteristic = null;
const throttle = (func, limit) => {
  let lastFunc;
  let lastRan;
  return function() {
    const context = this;
    const args = arguments;
    if (!lastRan) {
      func.apply(context, args);
      lastRan = Date.now();
    } else {
      clearTimeout(lastFunc);
      lastFunc = setTimeout(function() {
        if ((Date.now() - lastRan) >= limit) {
          func.apply(context, args);
          lastRan = Date.now();
        }
      }, limit - (Date.now() - lastRan));
    }
  };
};
const AdminPanel = () => {
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [isLoadingAuth, setIsLoadingAuth] = useState(false);

  // Admin panel state
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [newItemQuantity, setNewItemQuantity] = useState(1);
  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const [selectedMenuItem, setSelectedMenuItem] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [printerConnected, setPrinterConnected] = useState(false);
  const printerDeviceRef = useRef(null);
  const printerCharacteristicRef = useRef(null);
  const [activeTab, setActiveTab] = useState('all');
  const [currentPage, setCurrentPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [itemNotes, setItemNotes] = useState({});
  const [activeMenuTab, setActiveMenuTab] = useState('semana');
  const [orderHistory, setOrderHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);
  const [isClosingOrder, setIsClosingOrder] = useState(false);
  const [showTableDetailsModal, setShowTableDetailsModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('dinheiro');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [historyFilter, setHistoryFilter] = useState('all');
  const [historySearchTerm, setHistorySearchTerm] = useState('');
  const [historyDateRange, setHistoryDateRange] = useState({
    start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    end: new Date()
  });
  const [pendingItemsByTable, setPendingItemsByTable] = useState({});
  const [hasPendingItems, setHasPendingItems] = useState(false);
  const [isPedidosButtonFlashing, setIsPedidosButtonFlashing] = useState(false);
  const [showPendingOrdersModal, setShowPendingOrdersModal] = useState(false);
  const [allMarked, setAllMarked] = useState(false);
  const [selectedFlavor, setSelectedFlavor] = useState('');

  // Refs para scroll
  const menuCategoriesRef = useRef(null);
  const menuItemsRef = useRef(null);

  // Configuração inicial das mesas e comandas
  const initialTables = useCallback(() => {
    const tables = [];
    
    // Mesas internas (1-8)
    for (let i = 1; i <= 8; i++) {
      tables.push({
        id: i.toString(),
        type: 'interna',
        capacity: i <= 4 ? 4 : 6,
        location: 'Interno',
        status: 'available'
      });
    }
    
    // Mesas externas (9-16)
    for (let i = 9; i <= 16; i++) {
      tables.push({
        id: i.toString(),
        type: 'externa',
        capacity: i <= 12 ? 4 : 6,
        location: 'Externo',
        status: 'available'
      });
    }
    
    // Comandas (17-70)
    for (let i = 17; i <= 70; i++) {
      tables.push({
        id: i.toString(),
        type: 'comanda',
        capacity: 0,
        location: '',
        status: 'available'
      });
    }
    
    return tables;
  }, []);

  // Configurações da impressora Bluetooth
const PRINTER_CONFIG = {
  deviceName: "BlueTooth Printer",
  serviceUUID: "0000ff00-0000-1000-8000-00805f9b34fb",
  characteristicUUID: "0000ff02-0000-1000-8000-00805f9b34fb",
  maxRetries: 3,
  chunkSize: 100,
  delayBetweenChunks: 100,
  connectionMode: 'shared' 
};

  const NEW_ORDER_FLASH_DURATION = 5000; // 5 segundos de animação
  const NEW_ORDER_BADGE_DURATION = 30000; // 30 segundos do badge visível

  // Menu de itens
  const foodImages = {
    frangoCremoso,
    picanhaPremium: picanha,
    costelaRaiz,
    frangosupremo: frangoSupremo,
    feijoadaAstral,
    hamburguer,
    chorica,
    Asinha,
    Picanhacomfritas,
    Filetilapia,
    baldedecerveja,
    vegano,
    hamburgueraltoastral,
    sandespanado,
    negs,
    fritascomqueijo,
    costelaporco,
    pastelfeira,
    cafe,
    abatanado,
    chocolatequente,
    caipirinha,
    pedras,
    Somersby,
    Imperial,
    cerveja,
    sangria,
    refrigerantes,
    Coxinha,
    agua,
    kibe,
    bauru,
    fiambre,
    ovosebacon,
    tosta,
    croissant,
    paodequeijo,
    doces,
    sanduichenatural,
    tostaspremium,
    pasteldenata,
    empadafrango,
    hamburgao,
    meialeite,
    cha,
    croissanmisto,
    sandesmista,
    galao,
    cariocalimao,
    paocomovo,
    torradapaocaseiro,
    torradapaodeforma,
    bolaqueijo,
    pasteldestaque,
    tostamistapaoforma,
    Garoto,
    vodka,
    Caipiblack,
    fiambreequeijo,
    capuccino,
    Castelo,
    Cheesecake,
    maracuja,
    acerola,
    manga,
    goiaba,
    morango,
    Caju,
    abacaxi,
    coco,
    caja,
    cupuacu,
    graviola,
    frutosvermelhos,
    bolopoteananas,
    Prestígio,
    toblerone,
    pedrassabor,
    superbock,
    compal,
    energetico,
    happyhour,
  };
const menu = {
    semana: [
      { id: 1, name: 'Frango Cremoso', description: 'Strogonoff de frango, arroz branco, salada e batata palha', price: 12.90, veg: false, image: foodImages.frangoCremoso, rating: 4.5 },
      { id: 2, name: 'Maminha Top', description: 'Maminha grelhada, arroz branco, feijão tropeiro e vinagrete', price: 12.90, veg: false, image: foodImages.picanhaPremium, rating: 4.8 },
      { id: 3, name: 'Costela Raiz', description: 'Costela de vaca com mandioca, arroz branco, farofa e salada', price: 12.90, veg: false, image: foodImages.costelaRaiz, rating: 4.7 },
      { id: 4, name: 'Frango Supremo', description: 'Filé de frango à parmegiana, arroz branco, batata frita e salada', price: 12.90, veg: false, image: foodImages.frangosupremo, rating: 4.3 },
      { id: 5, name: 'Feijoada Astral', description: 'Feijoada brasileira, arroz branco, couve, farofa, torresmo e laranja', price: 12.90, veg: false, image: foodImages.feijoadaAstral, rating: 4.9 },
      { id: 6, name: 'Opção Vegetariana', description: 'Prato vegetariano sob consulta - acompanha bebida e café', price: 12.90, veg: true, image: foodImages.vegano, rating: 4.2 }
    ],
    lanches: [
      { id: 7, name: 'Hambúrguer com Fritas', description: 'Carne, alface, tomate, cebola, cheddar, molho da casa', price: 7.00, image: foodImages.hamburguer, rating: 4.4 },
      { id: 8, name: 'Hambúrguer Alto Astral', description: 'Carne 120g, bacon, queijo, anéis de cebola, alface, tomate, cheddar, molho coquetel e especial', price: 9.90, image: foodImages.hamburgueraltoastral, rating: 4.7 },
      { id: 9, name: 'Hambúrguer Neg\'s', description: 'Carne 120g, frango panado, bacon, queijo, anéis de cebola, cebola crispy, alface, tomate, cheddar, molho coquetel e especial', price: 12.90, image: foodImages.negs, rating: 4.9 },
      { id: 10, name: 'Sandes de Panado', description: 'Frango panado, alface, tomate, cebola, molho da casa', price: 5.50, image: foodImages.sandespanado, rating: 4.1 },
      { id: 11, name: 'Tosta Premium (Frango)', description: 'Acompanha queijo, alface, tomate e cebola roxa', price: 6.50, image: foodImages.tostaspremium, rating: 4.0 },
      { id: 12, name: 'Tosta Premium (Atum)', description: 'Acompanha queijo, alface, tomate e cebola roxa', price: 6.50, image: foodImages.tostaspremium, rating: 4.0 },
      { id: 13, name: 'Sanduíche Natural', description: 'Patê de frango, queijo, rúcula, tomate, cebola roxa e cenoura ralada', price: 6.50, image: foodImages.sanduichenatural, rating: 3.9 }
    ],
    porcoes: [
      { id: 14, name: 'Batata Frita', description: 'Porção com 400g de batata frita crocante', price: 4.00, image: foodImages.fritascomqueijo, rating: 4.2 },
      { id: 15, name: 'Fritas com Bacon e Queijo', description: 'Porção com 400g de batatas com bacon e queijo cheddar derretido', price: 6.50, image: foodImages.fritascomqueijo, rating: 4.6 },
      { id: 16, name: 'Chouriça com Cebola', description: 'Porção com 600g de chouriça acebolada e pão fatiado', price: 9.00, image: foodImages.chorica, rating: 4.5 },
      { id: 17, name: 'Asinha de Frango', description: 'Porção com 700g de asinhas de frango crocantes com molho barbecue', price: 12.00, image: foodImages.Asinha, rating: 4.4 },
      { id: 18, name: 'Costelinha', description: 'Porção com 800g de costelinha suína com molho barbecue', price: 12.00, image: foodImages.costelaporco, rating: 4.7 },
      { id: 19, name: 'Picanha com Fritas', description: 'Porção com 600g de tiras de picanha temperada com sal de parrilha e acompanhado de batata frita ou doce', price: 22.90, image: foodImages.Picanhacomfritas, rating: 4.8 },
      { id: 20, name: 'Filé de Tilápia', description: 'Porção com 800g de filé de tilápia grelhado com molho tartaro', price: 15.00, image: foodImages.Filetilapia, rating: 4.3 }
    ],
    pasteis: [
      { id: 21, name: 'Pastel Simples', description: 'Opções: Frango desfiado, carne picada ou queijo', price: 5.00, image: foodImages.pastelfeira, rating: 4.3 },
      { id: 22, name: 'Pastel de Frango com Queijo', description: 'Frango desfiado com queijo derretido', price: 5.50, image: foodImages.pastelfeira, rating: 4.5 },
      { id: 23, name: 'Pastel de Frango com Queijo e Bacon', description: 'Frango desfiado com queijo e bacon em cubos crocantes', price: 6.50, image: foodImages.pastelfeira, rating: 4.7 },
      { id: 24, name: 'Pastel de Carne com Queijo', description: 'Carne picada com queijo e azeitona', price: 5.50, image: foodImages.pastelfeira, rating: 4.4 },
      { id: 25, name: 'Pastel de Carne com Queijo e Bacon', description: 'Carne picada com queijo, azeitona e bacon em cubos', price: 6.50, image: foodImages.pastelfeira, rating: 4.6 },
      { id: 26, name: 'Pastel de Chouriça', description: 'Recheio de queijo, chouriça e milho', price: 5.50, image: foodImages.pastelfeira, rating: 4.2 },
      { id: 27, name: 'Pastel Misto', description: 'Fiambre, queijo, azeitona e milho', price: 5.50, image: foodImages.pastelfeira, rating: 4.1 },
      { id: 28, name: 'Pastel de Pizza', description: 'Queijo, fiambre, tomate e orégano', price: 5.50, image: foodImages.pastelfeira, rating: 4.0 },
      { id: 29, name: 'Pastel Alto Astral', description: 'Queijo, bacon, tomate, azeitona, cheddar e orégano', price: 6.50, image: foodImages.pastelfeira, rating: 4.8 },
      { id: 30, name: 'Pastel Romeu e Julieta', description: 'Combinação clássica de queijo com goiabada', price: 5.50, image: foodImages.pastelfeira, rating: 4.7 },
      { id: 31, name: 'Pastel de Banana com Nutella', description: 'Queijo, banana e nutella cremosa', price: 6.00, image: foodImages.pastelfeira, rating: 4.9 }
    ],
    cafe: [
      { id: 32, name: 'Café Expresso', description: 'Café espresso tradicional', price: 1.00, image: foodImages.cafe, rating: 4.5 },
      { id: 33, name: 'Café Descafeinado', description: 'Café espresso sem cafeína', price: 1.00, image: foodImages.cafe, rating: 4.3 },
      { id: 34, name: 'Café Duplo', description: 'Dose dupla de café espresso', price: 2.00, image: foodImages.cafe, rating: 4.6 },
      { id: 35, name: 'Garoto', description: 'Café com pequena quantidade de leite', price: 1.00, image: foodImages.Garoto, rating: 4.2 },
      { id: 36, name: 'Abatanado', description: 'Café longo com mais água', price: 1.10, image: foodImages.abatanado, rating: 4.1 },
      { id: 37, name: 'Meia de Leite', description: 'Metade café e metade leite vaporizado', price: 1.50, image: foodImages.meialeite, rating: 4.4 },
      { id: 38, name: 'Galão', description: '1/4 de café e 3/4 de leite vaporizado', price: 1.60, image: foodImages.galao, rating: 4.5 },
      { id: 39, name: 'Chá', description: 'Chá preto ou de frutas', price: 1.60, image: foodImages.cha, rating: 4.0 },
      { id: 40, name: 'Cappuccino', description: 'Café espresso com leite vaporizado e espuma de leite', price: 3.00, image: foodImages.capuccino, rating: 4.7 },
      { id: 41, name: 'Carioca de Limão', description: 'Chá de casca de limão', price: 1.00, image: foodImages.cariocalimao, rating: 3.9 },
      { id: 42, name: 'Chocolate Quente', description: 'Chocolate quente cremoso', price: 3.00, image: foodImages.chocolatequente, rating: 4.8 },
      { id: 43, name: 'Torrada com Pão Caseiro', description: 'Torrada feita com pão artesanal', price: 2.00, image: foodImages.torradapaocaseiro, rating: 4.3 },
      { id: 44, name: 'Torrada com Pão de Forma', description: 'Torrada simples com pão de forma', price: 1.50, image: foodImages.torradapaodeforma, rating: 4.1 },
      { id: 45, name: 'Meia Torrada', description: 'Meia porção de torrada', price: 1.00, image: foodImages.torradapaocaseiro, rating: 4.0 },
      { id: 46, name: 'Croissant Misto', description: 'Croissant com fiambre e queijo', price: 3.00, image: foodImages.croissanmisto, rating: 4.6 },
      { id: 47, name: 'Croissant Misto Tostado', description: 'Croissant misto grelhado', price: 3.20, image: foodImages.croissant, rating: 4.7 },
      { id: 48, name: 'Tosta Mista', description: 'Tosta de pão caseiro com fiambre e queijo', price: 3.20, image: foodImages.tosta, rating: 4.5 },
      { id: 49, name: 'Tosta Mista (Pão de Forma)', description: 'Tosta de pão de forma com fiambre e queijo', price: 2.80, image: foodImages.tostamistapaoforma, rating: 4.4 },
      { id: 50, name: 'Sandes Mista', description: 'Sandes simples com fiambre e queijo', price: 2.20, image: foodImages.sandesmista, rating: 4.2 },
      { id: 51, name: 'Pão com Ovo', description: 'Pão com ovo estrelado', price: 2.20, image: foodImages.paocomovo, rating: 4.1 },
      { id: 52, name: 'Ovos com Bacon', description: 'Ovos mexidos com bacon crocante', price: 4.00, image: foodImages.ovosebacon, rating: 4.7 }
    ],
    bebidas: [
      { id: 53, name: 'Caipirinha', description: 'Cachaça 51 ou Velho Barreiro, lima, açúcar e gelo', price: 6.00, image: foodImages.caipirinha, rating: 4.8 },
      { id: 54, name: 'Caipiblack', description: 'Cachaça preta, lima, açúcar e gelo', price: 6.00, image: foodImages.Caipiblack, rating: 4.9 },
      { id: 55, name: 'Whiskey Jamenson', description: 'Dose de whiskey Jamenson', price: 3.50, image: foodImages.vodka, rating: 4.7 },
      { id: 56, name: 'Whiskey J&B', description: 'Dose de whiskey J&B', price: 3.00, image: foodImages.vodka, rating: 4.5 },
      { id: 57, name: 'Whiskey Jack Daniels', description: 'Dose de whiskey Jack Daniels', price: 3.50, image: foodImages.vodka, rating: 4.8 },
      { id: 58, name: 'Whiskey Black Label', description: 'Dose de whiskey Black Label', price: 4.00, image: foodImages.vodka, rating: 4.9 },
      { id: 59, name: 'Vodka', description: 'Dose de vodka', price: 4.00, image: foodImages.vodka, rating: 4.6 },
      { id: 60, name: 'Somersby', description: 'Cidra Somersby refrescante', price: 2.50, image: foodImages.Somersby, rating: 4.4 },
      { id: 61, name: 'Imperial Heineken (0.20)', description: 'Imperial de cerveja Heineken 200ml', price: 1.50, image: foodImages.Imperial, rating: 4.5 },
      { id: 62, name: 'Caneca Heineken (0.50)', description: 'Caneca de cerveja Heineken 500ml', price: 3.00, image: foodImages.Imperial, rating: 4.7 },
      { id: 63, name: 'Cerveja Garrafa (0.33ml)', description: 'Garrafa de cerveja 330ml', price: 1.40, image: foodImages.cerveja, rating: 4.3 },
      { id: 64, name: 'Cerveja Mini (0.20ml)', description: 'Mini garrafa de cerveja 200ml', price: 1.10, image: foodImages.cerveja, rating: 4.2 },
      { id: 65, name: 'Superbock Preta', description: 'Cerveja Superbock Preta', price: 1.40, image: foodImages.superbock, rating: 4.2 },
      { id: 66, name: 'Taça de Sangria', description: 'Sangria branca, rosé ou tinta', price: 6.00, image: foodImages.sangria, rating: 4.8 },
      { 
        id: 'happy-hour', 
        name: 'Caneca Happy Hour', 
        description: 'Caneca de cerveja especial durante o horário de happy hour', 
        price: 2.50, 
        image: foodImages.happyhour, 
        rating: 4.5 
      },
      { 
        id: 'compal', 
        name: 'Compal', 
        price: 1.60, 
        image: foodImages.compal, 
        flavorOptions: [
          'Frutos Vermelhos',
          'Maracujá',
          'Manga',
          'Maçã',
          'Pêra',
          'Pêssego',
          'Manga-Laranja',
          'Goiaba',
          'Ananás',
        ],
        description: 'Sumo natural de fruta.',
        rating: 4.2
      },
      { 
        id: 'energeticos', 
        name: 'Energético', 
        image: foodImages.energetico,
        price: 2.50,
        options: [
          { name: 'Red Bull', price: 2.50 },
          { name: 'Monster', price: 2.50 },
          { name: 'Hell', price: 1.80 },
        ],
        description: 'Energéticos gelados.',
        rating: 4.3
      },
      { 
        id: 'refrigerantes-lata', 
        name: 'Refrigerante Lata', 
        description: 'Refrigerantes em lata 330ml', 
        price: 1.60, 
        image: foodImages.refrigerantes, 
        rating: 4.1,
        flavorOptions: [
          'Coca-Cola',
          'Coca-Cola Zero',
          'Fanta Laranja',
          'Pepsi',
          'Guaraná do Brasil',
          'Sprite'
        ]
      },
      { id: 68, name: 'Água 1.5L', description: 'Garrafa de água mineral 1.5 litros', price: 1.50, image: foodImages.agua, rating: 4.0 },
      { id: 69, name: 'Água 0.5L', description: 'Garrafa de água mineral 500ml', price: 1.00, image: foodImages.agua, rating: 4.0 },
      { id: 70, name: 'Água 0.33L', description: 'Garrafa de água mineral 330ml', price: 0.60, image: foodImages.agua, rating: 4.0 },
      { id: 71, name: 'Água Castelo', description: 'Água mineral Castelo', price: 1.40, image: foodImages.Castelo, rating: 4.2 },
      { id: 72, name: 'Água das Pedras', description: 'Água mineral gaseificada', price: 1.50, image: foodImages.pedras, rating: 4.3 },
      { id: 73, name: 'Água das Pedras C/ Sabor', description: 'Água mineral gaseificada com sabor', price: 1.80, image: foodImages.pedrassabor, rating: 4.3 },
      { id: 74, name: 'Balde de Heineken', description: 'Balde com 5 cervejas Heineken', price: 10.00, image: foodImages.baldedecerveja, rating: 4.9 }
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
        image: foodImages.maracuja,
        veg: true,
        nutritionalInfo: 'Alto teor de vitamina A, C, ferro e fibras. 120kcal (com água)',
        rating: 4.7
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
        image: foodImages.acerola,
        veg: true,
        nutritionalInfo: 'Contém 30x mais vitamina C que a laranja. 110kcal (com água)',
        rating: 4.6
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
        image: foodImages.manga,
        veg: true,
        nutritionalInfo: 'Fonte de vitamina A, C e fibras. 150kcal (com água)',
        rating: 4.5
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
        image: foodImages.goiaba,
        veg: true,
        nutritionalInfo: 'Rica em antioxidantes e fibras. 130kcal (com água)',
        rating: 4.4
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
        image: foodImages.morango,
        veg: true,
        nutritionalInfo: 'Contém manganês, potássio e vitamina C. 100kcal (com água)',
        rating: 4.6
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
        image: foodImages.Caju,
        veg: true,
        nutritionalInfo: 'Fonte de vitamina C e minerais. 140kcal (com água)',
        rating: 4.3
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
        image: foodImages.abacaxi,
        veg: true,
        nutritionalInfo: 'Diurético natural e rico em vitamina C. 120kcal (com água)',
        rating: 4.5
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
        image: foodImages.coco,
        veg: true,
        nutritionalInfo: 'Fonte de minerais e ácidos graxos. 180kcal (com água)',
        rating: 4.7
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
        image: foodImages.caja,
        veg: true,
        nutritionalInfo: 'Contém cálcio, fósforo e ferro. 130kcal (com água)',
        rating: 4.2
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
        image: foodImages.cupuacu,
        veg: true,
        nutritionalInfo: 'Fonte de teobromina e ácidos graxos. 160kcal (com água)',
        rating: 4.8
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
        image: foodImages.graviola,
        veg: true,
        nutritionalInfo: 'Rica em vitaminas B1, B2 e C. 140kcal (com água)',
        rating: 4.4
      }
    ],
    salgados: [
      { id: 75, name: 'Pão de Queijo', description: 'Pão de queijo mineiro tradicional', price: 1.60, image: foodImages.paodequeijo, rating: 4.5 },
      { id: 76, name: 'Pastel de Nata', description: 'Pastel de nata português tradicional', price: 1.30, image: foodImages.pasteldenata, rating: 4.7 },
      { id: 77, name: 'Empada de Frango', description: 'Empada caseira recheada com frango', price: 2.00, image: foodImages.empadafrango, rating: 4.4 },
      { id: 78, name: 'Kibe', description: 'Kibe frito crocante', price: 2.20, image: foodImages.kibe, rating: 4.3 },
      { id: 79, name: 'Enroladinho de Salsicha e Queijo', description: 'Massa crocante recheada com salsicha e queijo', price: 2.20, image: foodImages.fiambre, rating: 4.2 },
      { id: 80, name: 'Fiambre e Queijo', description: 'Pão com fiambre e queijo', price: 2.20, image: foodImages.fiambreequeijo, rating: 4.2 },
      { id: 81, name: 'Bauru', description: 'Pão com rosbife, queijo, tomate e picles', price: 2.20, image: foodImages.bauru, rating: 4.1 },
      { id: 82, name: 'Bola de Queijo', description: 'Bolinho de queijo frito', price: 2.20, image: foodImages.bolaqueijo, rating: 4.3 },
      { id: 83, name: 'Coxinha de Frango', description: 'Coxinha de frango tradicional', price: 2.20, image: foodImages.Coxinha, rating: 4.6 },
      { id: 84, name: 'Coxinha com Catupiry', description: 'Coxinha de frango com recheio de catupiry', price: 3.00, image: foodImages.Coxinha, rating: 4.8 },
      { id: 85, name: 'Hamburgão', description: 'Hambúrguer grande no pão', price: 3.50, image: foodImages.hamburgao, rating: 4.7 }
    ],
    sobremesas: [
      { id: 86, name: 'Bolo no Pote - Prestígio', description: 'Chocolate com coco', price: 4.00, image: foodImages.Prestígio, rating: 4.8 },
      { id: 87, name: 'Bolo no Pote - Chocolate', description: 'Massa de chocolate com recheio de chocolate', price: 4.00, image: foodImages.doces, rating: 4.9 },
      { id: 88, name: 'Bolo no Pote - Ananás', description: 'Creme de ninho com pedaços de ananás', price: 4.00, image: foodImages.bolopoteananas, rating: 4.7 },
      { id: 89, name: 'Bolo no Pote - Choco Misto', description: 'Chocolate preto com ninho', price: 4.00, image: foodImages.doces, rating: 4.8 },
      { id: 90, name: 'Cheesecake - Goiabada', description: 'Cheesecake com calda de goiabada', price: 3.50, image: foodImages.Cheesecake, rating: 4.7 },
      { id: 91, name: 'Cheesecake - Frutos Vermelhos', description: 'Cheesecake com calda de frutos vermelhos', price: 3.50, image: foodImages.frutosvermelhos, rating: 4.8 },
      { id: 92, name: 'Brigadeiro Tradicional', description: 'Brigadeiro de chocolate tradicional', price: 1.50, image: foodImages.doces, rating: 4.6 },
      { id: 93, name: 'Brigadeiro Beijinho', description: 'Brigadeiro de coco', price: 1.50, image: foodImages.doces, rating: 4.5 },
      { id: 94, name: 'Brigadeiro Ninho', description: 'Brigadeiro feito com leite ninho', price: 2.00, image: foodImages.doces, rating: 4.8 },
      { id: 95, name: 'Brigadeiro Paçoca', description: 'Brigadeiro com paçoca', price: 2.00, image: foodImages.doces, rating: 4.7 },
      { id: 96, name: 'Brigadeiro Morango', description: 'Brigadeiro com morango', price: 2.00, image: foodImages.doces, rating: 4.8 },
      { id: 97, name: 'Brigadeiro Churros', description: 'Brigadeiro com sabor de churros', price: 2.00, image: foodImages.doces, rating: 4.9 },
      { id: 98, name: 'Tarte de Toblerone', description: 'Tarte com chocolate Toblerone', price: 2.20, image: foodImages.toblerone, rating: 4.7 },
      { id: 99, name: 'Bolo de Brigadeiro (fatia)', description: 'Fatia de bolo de brigadeiro', price: 2.20, image: foodImages.doces, rating: 4.8 }
    ]
  };

useEffect(() => {
const checkPendingItems = () => {
  const pendingItems = {};
  let hasPending = false;

  tables.forEach(table => {
    if (table.currentOrder) {
      // Adicione esta condição para filtrar itens manuais
      const unprintedItems = table.currentOrder.items.filter(item => 
        !item.printed && !item.addedBy
      );
      
      if (unprintedItems.length > 0) {
        pendingItems[table.id] = {
          tableId: table.id,
          tableType: table.type,
          items: unprintedItems
        };
        hasPending = true;
      }
    }
  });

  setPendingItemsByTable(pendingItems);
  setHasPendingItems(hasPending);
  
  if (hasPending) {
    setIsPedidosButtonFlashing(true);
    const timer = setTimeout(() => setIsPedidosButtonFlashing(false), 10000);
    return () => clearTimeout(timer);
  }
};

  const interval = setInterval(checkPendingItems, 5000);
  return () => clearInterval(interval);
}, [tables]);

  // Efeito para verificar autenticação
useEffect(() => {
  const auth = getAuth();
  const unsubscribe = auth.onAuthStateChanged(async (user) => {
    if (user) {
      setIsAuthenticated(true);
      
      // Tentar reconectar apenas se não estiver já conectado
      if (!printerDeviceRef.current?.gatt?.connected && 
          !globalPrinterDevice?.gatt?.connected) {
        const success = await handleReconnectPrinter();
        
        // Se a reconexão automática falhar, oferecer opção manual
        if (!success) {
          setError('Impressora desconectada');
        }
      }
    } else {
      setIsAuthenticated(false);
    }
  });

  // Adicione este listener para tentar reconectar quando a página ganhar foco
  const handleVisibilityChange = () => {
    if (document.visibilityState === 'visible' && 
        !printerDeviceRef.current?.gatt?.connected &&
        isAuthenticated) {
      handleReconnectPrinter();
    }
  };

  document.addEventListener('visibilitychange', handleVisibilityChange);

  return () => {
    unsubscribe();
    document.removeEventListener('visibilitychange', handleVisibilityChange);
  };
}, [isAuthenticated]);


  const handleMarkAll = async () => {
    await Promise.all(
      Object.keys(pendingItemsByTable).map(tableId => 
        markAllItemsAsPrinted(tableId)
    ));
    setAllMarked(true);
  };

  // Função para fechar pedido automaticamente quando não há itens
const closeOrderAutomatically = useCallback(async (order) => {
  if (!selectedTable || !order?.id) return;
  
  try {
    const tableRef = ref(database, `tables/${selectedTable}`);
    const orderRef = ref(database, `tables/${selectedTable}/currentOrder/${order.id}`);

    // Remove o pedido atual primeiro
    await remove(orderRef);
    
    // Depois atualiza o status da mesa
    await update(tableRef, {
      status: 'available'
    });

    // Atualização local otimizada
    setTables(prevTables => prevTables.map(t => 
      t.id === selectedTable ? {...t, currentOrder: null, status: 'available'} : t
    ));
    
    setSelectedOrder(null);

  } catch (error) {
    console.error("Erro ao fechar comanda:", error);
  }
}, [selectedTable]);

  // Efeito para pesquisa
useEffect(() => {
  if (searchTerm.trim() === '') {
    setSearchResults([]);
    setShowSearchResults(false);
    return;
  }

    const results = [];
    const lowerCaseTerm = searchTerm.toLowerCase();

    Object.values(menu).forEach(category => {
      category.forEach(item => {
        if (item.name.toLowerCase().includes(lowerCaseTerm) || 
            (item.description && item.description.toLowerCase().includes(lowerCaseTerm))) {
          results.push(item);
        }
      });
    });

    setSearchResults(results);
    setShowSearchResults(results.length > 0);
  }, [searchTerm, menu]);

useEffect(() => {
  if (!isAuthenticated) return;

  const processTablesData = (data) => {
    return initialTables().map(table => {
      const tableData = data[table.id] || {};
      let currentOrder = null;
      
      if (tableData.currentOrder) {
        const orders = Object.entries(tableData.currentOrder);
        if (orders.length > 0) {
          currentOrder = {
            id: orders[0][0],
            ...orders[0][1],
            items: orders[0][1].items?.map(item => ({
              ...item,
              notes: item.notes || '',
              printed: item.printed || false
            })) || []
          };
        }
      }

      return { 
        ...table,
        currentOrder,
        ordersHistory: tableData.ordersHistory || {},
        status: tableData.status || 'available'
      };
    });
  };

  const tablesRef = ref(database, 'tables');
  const unsubscribe = onValue(tablesRef, (snapshot) => {
    const data = snapshot.val() || {};
    setTables(processTablesData(data));
    setLastUpdate(new Date());
  });

  return () => unsubscribe();
}, [isAuthenticated, initialTables]);

  // Funções de persistência da impressora
const savePrinterState = useCallback((device, characteristic) => {
  try {
    localStorage.setItem('bluetoothPrinter', JSON.stringify({
      deviceId: device.id,
      deviceName: device.name,
      connected: true,
      lastConnected: Date.now()
    }));
  } catch (err) {
    console.error('Erro ao salvar estado da impressora:', err);
  }
}, []);

  const clearPrinterState = useCallback(() => {
    localStorage.removeItem('bluetoothPrinter');
    setPrinterConnected(false);
  }, []);

const handleDisconnection = useCallback(() => {
  console.log('Limpando estado da impressora');
  clearPrinterState();
  printerDeviceRef.current = null;
  printerCharacteristicRef.current = null;
  globalPrinterDevice = null;
  globalPrinterCharacteristic = null;
  setPrinterConnected(false);
}, [clearPrinterState]);

  // Função para reconectar impressora
  const handleReconnectPrinter = useCallback(async () => {
    try {
      const savedPrinter = localStorage.getItem('bluetoothPrinter');
      if (!savedPrinter) return false;

      const printerState = JSON.parse(savedPrinter);
      if (!printerState.deviceId || !printerState.connected) return false;

      const isRecentConnection = Date.now() - printerState.lastConnected < 5 * 60 * 1000;
      if (!isRecentConnection) {
        clearPrinterState();
        return false;
      }

      console.log('Tentando reconectar à impressora...');

      const device = await navigator.bluetooth.requestDevice({
        filters: [{ name: printerState.deviceName }],
        optionalServices: [PRINTER_CONFIG.serviceUUID]
      });

      if (!device) {
        clearPrinterState();
        return false;
      }

      device.addEventListener('gattserverdisconnected', handleDisconnection);

      console.log('Conectando ao servidor GATT...');
      const server = await device.gatt.connect();
      
      console.log('Obtendo serviço...');
      const service = await server.getPrimaryService(PRINTER_CONFIG.serviceUUID);
      
      console.log('Obtendo característica...');
      const characteristic = await service.getCharacteristic(PRINTER_CONFIG.characteristicUUID);

      printerDeviceRef.current = device;
      printerCharacteristicRef.current = characteristic;
      setPrinterConnected(true);
      savePrinterState(device, characteristic);

      console.log('Reconectado com sucesso à impressora');
      return true;
    } catch (err) {
      console.error('Erro na reconexão Bluetooth:', err);
      clearPrinterState();
      return false;
    }
  }, [PRINTER_CONFIG.serviceUUID, PRINTER_CONFIG.characteristicUUID, handleDisconnection, savePrinterState, clearPrinterState]);

  // Função para conectar à impressora
const connectToPrinter = useCallback(async () => {
  try {
    if (!navigator.bluetooth) {
      throw new Error('Bluetooth não suportado neste navegador');
    }

    // Se já estiver conectado, retornar
      if (globalPrinterDevice?.gatt?.connected && PRINTER_CONFIG.connectionMode === 'shared') {
      setPrinterConnected(true);
      return true;
    }

    setLoading(true);
    setError(null);

    const device = await navigator.bluetooth.requestDevice({
      filters: [{ name: PRINTER_CONFIG.deviceName }],
      optionalServices: [PRINTER_CONFIG.serviceUUID]
    });

    if (!device) {
      throw new Error('Nenhum dispositivo selecionado');
    }

    device.addEventListener('gattserverdisconnected', () => {
      console.log('Dispositivo desconectado');
      handleDisconnection();
    });

    const server = await device.gatt.connect();
    const service = await server.getPrimaryService(PRINTER_CONFIG.serviceUUID);
    const characteristic = await service.getCharacteristic(PRINTER_CONFIG.characteristicUUID);

    // Atualizar tanto as refs quanto as variáveis globais
    printerDeviceRef.current = device;
    printerCharacteristicRef.current = characteristic;
    globalPrinterDevice = device;
    globalPrinterCharacteristic = characteristic;
    
    setPrinterConnected(true);
    savePrinterState(device, characteristic);
    device.gatt.keepBond = true;
    return true;

  } catch (err) {
    console.error('Erro na conexão Bluetooth:', err);
    setError(`Falha na conexão: ${err.message}`);
    return false;
  } finally {
    setLoading(false);
  }
}, [PRINTER_CONFIG.serviceUUID, PRINTER_CONFIG.characteristicUUID, handleDisconnection, savePrinterState]);

  // Função para enviar dados para impressora
  const sendToPrinter = useCallback(async (data) => {
    let retryCount = 0;
    
    while (retryCount < PRINTER_CONFIG.maxRetries) {
      try {
        if (!printerDeviceRef.current?.gatt?.connected) {
          console.log(`Tentativa ${retryCount + 1}: Reconectando...`);
          const connected = await connectToPrinter();
          if (!connected) throw new Error('Falha ao reconectar');
        }
  
        const encoder = new TextEncoder();
        const encodedData = encoder.encode(data);
        let offset = 0;
        
        console.log(`Enviando ${encodedData.length} bytes...`);
        
        while (offset < encodedData.length) {
          const chunk = encodedData.slice(offset, offset + PRINTER_CONFIG.chunkSize);
          await printerCharacteristicRef.current.writeValueWithoutResponse(chunk);
          offset += PRINTER_CONFIG.chunkSize;
          
          await new Promise(resolve => 
            setTimeout(resolve, PRINTER_CONFIG.delayBetweenChunks)
          );
        }
        
        console.log('Dados enviados com sucesso');
        return true;
        
      } catch (err) {
        retryCount++;
        console.error(`Tentativa ${retryCount} falhou:`, err);
        
        if (retryCount >= PRINTER_CONFIG.maxRetries) {
          console.error('Número máximo de tentativas atingido');
          setError(`Falha na impressão: ${err.message}`);
          return false;
        }
        
        await new Promise(resolve => 
          setTimeout(resolve, 1000 * retryCount)
        );
      }
    }
  }, [PRINTER_CONFIG, connectToPrinter]);

  // Função para formatar recibo
const formatReceipt = useCallback((order) => {
  if (!order || !order.items || order.items.length === 0) return '';

  const ESC = '\x1B';
  const GS = '\x1D';
  const INIT = `${ESC}@`;
  const CENTER = `${ESC}a1`;
  const LEFT = `${ESC}a0`;
  const BOLD_ON = `${ESC}!${String.fromCharCode(8)}`;
  const BOLD_OFF = `${ESC}!${String.fromCharCode(0)}`;
  const CUT = `${GS}V0`;
  const LF = '\x0A';
  const FEED = '\x1Bd';
  const DIVIDER = '--------------------------------';

  let receipt = INIT;
  receipt += `${CENTER}${BOLD_ON}ALTO ASTRAL${BOLD_OFF}${LF}`;
  receipt += `${CENTER}${new Date().toLocaleString()}${LF}`;
  receipt += `${CENTER}${LF}`;
  
  const table = tables.find(t => t.id === selectedTable);
  receipt += `${LEFT}${BOLD_ON}${table?.type === 'comanda' ? 'COMANDA' : 'MESA'}: ${selectedTable}${BOLD_OFF}${LF}${LF}`;
  
  const isDelivery = table?.type === 'comanda' && order.deliveryAddress;
  let total = calculateOrderTotal(order);
  let deliveryFee = 0;
  
  if (isDelivery) {
    deliveryFee = 2.50;
    total += deliveryFee;
    receipt += `${LEFT}Endereco: ${order.deliveryAddress}${LF}${LF}`;
  }
  
  receipt += `${LEFT}${DIVIDER}${LF}`;
  receipt += `${LEFT}${BOLD_ON}ITENS${BOLD_OFF}${LF}`;
  receipt += `${LEFT}${DIVIDER}${LF}`;
  
  order.items.forEach(item => {
    receipt += `${LEFT}${BOLD_ON}${item.quantity}x ${item.name}${BOLD_OFF}${LF}`;
    if (item.description) {
      receipt += `${LEFT}${item.description}${LF}`;
    }
    if (item.notes) {
      receipt += `${LEFT}OBS: ${item.notes}${LF}`;
    }
    receipt += `${LEFT}Preço:  ${item.price.toFixed(2)} x ${item.quantity} =  ${(item.price * item.quantity).toFixed(2)}${LF}${LF}`;
  });
  
  if (isDelivery) {
    receipt += `${LEFT}${DIVIDER}${LF}`;
    receipt += `${LEFT}${BOLD_ON}Taxa de Entrega:  ${deliveryFee.toFixed(2)}${BOLD_OFF}${LF}`;
  }
  
  receipt += `${LEFT}${DIVIDER}${LF}`;
  receipt += `${LEFT}${BOLD_ON}TOTAL:  ${total.toFixed(2)}${BOLD_OFF}${LF}${LF}`;
  
  if (order.kitchenNotes) {
    receipt += `${LEFT}${DIVIDER}${LF}`;
    receipt += `${LEFT}${BOLD_ON}OBSERVACOES DA COZINHA:${BOLD_OFF}${LF}`;
    receipt += `${LEFT}${order.kitchenNotes}${LF}${LF}`;
  }

  receipt += `${LEFT}${DIVIDER}${LF}`;
  receipt += `${CENTER}Obrigado pela sua preferencia!${LF}`;
  receipt += `${CENTER}Volte sempre${LF}`;
  receipt += `${LF}`; // Reduzido para apenas 1 linha de espaço
  receipt += `${CUT}`;

  return receipt;
}, [selectedTable, tables]);

const markOrderAsViewed = (tableId) => {
  setNewOrders(prev => {
    const newState = {...prev};
    delete newState[tableId];
    return newState;
  });
  setFlashingTables(prev => {
    const newState = {...prev};
    delete newState[tableId];
    return newState;
  });
};

// Add this function with your other utility functions
const markItemsAsPrinted = async (tableId, orderId, itemsToMark) => {
  try {
    const orderRef = ref(database, `tables/${tableId}/currentOrder/${orderId}`);
    const snapshot = await get(orderRef);
    
    if (snapshot.exists()) {
      const currentOrder = snapshot.val();
      const updatedItems = currentOrder.items.map(item => {
        const shouldMark = itemsToMark.some(
          i => i.id === item.id && i.addedAt === item.addedAt
        );
        return shouldMark ? {...item, printed: true} : item;
      });
      
      return updatedItems;
    }
    return [];
  } catch (error) {
    console.error("Error marking items as printed:", error);
    return [];
  }
};

  // Função para marcar itens como impressos
const markItemAsPrinted = async (tableId, item) => {
  try {
    const orderRef = ref(database, `tables/${tableId}/currentOrder`);
    const snapshot = await get(orderRef);
    
    if (snapshot.exists()) {
      const orderData = snapshot.val();
      const orderKey = Object.keys(orderData)[0];
      const currentOrder = orderData[orderKey];
      
      const updatedItems = currentOrder.items.map(orderItem => 
        orderItem.id === item.id && orderItem.addedAt === item.addedAt
          ? { ...orderItem, printed: true }
          : orderItem
      );
      
      await update(ref(database, `tables/${tableId}/currentOrder/${orderKey}`), {
        items: updatedItems,
        updatedAt: Date.now()
      });
      
      // Atualizar estado local
      setPendingItemsByTable(prev => {
        const newState = { ...prev };
        if (newState[tableId]) {
          newState[tableId].items = newState[tableId].items.filter(
            i => !(i.id === item.id && i.addedAt === item.addedAt)
          );
          
          if (newState[tableId].items.length === 0) {
            delete newState[tableId];
          }
        }
        return newState;
      });
    }
  } catch (error) {
    console.error("Erro ao marcar item como impresso:", error);
    setError("Falha ao enviar item para cozinha");
  }
};

const markAllItemsAsPrinted = async (tableId) => {
  try {
    const orderRef = ref(database, `tables/${tableId}/currentOrder`);
    const snapshot = await get(orderRef);
    
    if (snapshot.exists()) {
      const orderData = snapshot.val();
      const orderKey = Object.keys(orderData)[0];
      const currentOrder = orderData[orderKey];
      
      const updatedItems = currentOrder.items.map(item => ({
        ...item,
        printed: true
      }));
      
      await update(ref(database, `tables/${tableId}/currentOrder/${orderKey}`), {
        items: updatedItems,
        updatedAt: Date.now()
      });
      
      // Atualizar estado local
      setPendingItemsByTable(prev => {
        const newState = { ...prev };
        delete newState[tableId];
        return newState;
      });
    }
  } catch (error) {
    console.error("Erro ao marcar todos os itens como impressos:", error);
    setError("Falha ao enviar itens para cozinha");
  }
};

  // Função para imprimir pedido
// Add these state declarations at the top with your other useState declarations
const [newOrders, setNewOrders] = useState({});
const [flashingTables, setFlashingTables] = useState({});
const [tablesWithNewItems, setTablesWithNewItems] = useState({});


// Here's the corrected printOrder function
const printOrder = useCallback(async () => {
  if (!selectedTable || !selectedOrder?.id || !selectedOrder.items?.length) {
    setError('Nenhum pedido válido para imprimir');
    return;
  }

  try {
    setIsPrinting(true);
    setError(null);
    
    // Filtra itens não impressos
    const itemsToPrint = selectedOrder.items.filter(item => !item.printed);

    if (itemsToPrint.length === 0) {
      setError('Nenhum novo item para imprimir');
      return;
    }

    const receipt = formatReceipt({
      ...selectedOrder,
      items: itemsToPrint
    });

    const success = await sendToPrinter(receipt);
    
    if (success) {
      // Atualiza o Firebase
      const orderRef = ref(database, `tables/${selectedTable}/currentOrder/${selectedOrder.id}`);
      
      const updatedItems = await markItemsAsPrinted(selectedTable, selectedOrder.id, itemsToPrint);
      setSelectedOrder(prev => ({
        ...prev,
        items: updatedItems
      }));

      await update(orderRef, {
        items: updatedItems,
        updatedAt: Date.now(),
        lastViewedAt: Date.now() // Adiciona esta linha para marcar como visualizado
      });

      // Atualiza o estado local
      setSelectedOrder(prev => ({
        ...prev,
        items: updatedItems
      }));

      // Remove o alerta visual
      setTablesWithNewItems(prev => {
        const newState = {...prev};
        delete newState[selectedTable];
        return newState;
      });
    }
  } catch (err) {
    console.error('Erro ao imprimir:', err);
    setError(`Falha na impressão: ${err.message}`);
  } finally {
    setIsPrinting(false);
  }
}, [selectedTable, selectedOrder, formatReceipt, sendToPrinter]);

  // Função para criar novo pedido
  const createNewOrder = useCallback(async () => {
    if (!selectedTable) return;
    
    setLoading(true);
    try {
      const orderRef = ref(database, `tables/${selectedTable}/currentOrder`);
      const newOrderRef = push(orderRef);
      
      const newOrder = {
        id: newOrderRef.key,
        items: [],
        status: 'open',
        createdAt: Date.now(),
        updatedAt: Date.now(),
        tableId: selectedTable,
        deliveryAddress: deliveryAddress
      };

      await set(newOrderRef, newOrder);
      setSelectedOrder(newOrder);
      
      // Atualizar status da mesa/comanda
      const tableRef = ref(database, `tables/${selectedTable}`);
      await update(tableRef, {
        status: 'occupied'
      });
    } catch (err) {
      setError('Erro ao criar novo pedido');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [selectedTable, deliveryAddress]);


const addItemToOrder = useCallback(async () => {
  if (!selectedTable || !selectedMenuItem) return;

  setLoading(true);
  setError(null); // Limpa erros anteriores

  try {
    // Cria o objeto do item base
    let newItem = {
      id: selectedMenuItem.id,
      name: selectedMenuItem.name,
      price: selectedMenuItem.price || 0,
      quantity: newItemQuantity,
      addedAt: Date.now(),
      printed: false, 
      notes: itemNotes[selectedMenuItem.id] || '',
      image: selectedMenuItem.image,
      description: selectedMenuItem.description,
      rating: selectedMenuItem.rating,
      addedBy: 'waiter' 
    };

    // Trata itens com seleção de sabor/marca
    if (selectedMenuItem.flavorOptions && selectedFlavor) {
      newItem = {
        ...newItem,
        name: `${selectedMenuItem.name} (${selectedFlavor})`,
        flavor: selectedFlavor
      };
    }

    // Trata energéticos especificamente
    if (selectedMenuItem.id === 'energeticos' && selectedMenuItem.options && selectedFlavor) {
      const selectedOption = selectedMenuItem.options.find(o => o.name === selectedFlavor);
      newItem = {
        ...newItem,
        name: `${selectedMenuItem.name} (${selectedFlavor})`,
        price: selectedOption?.price || selectedMenuItem.price,
        flavor: selectedFlavor
      };
    }

    // Verifica se todos os campos obrigatórios estão presentes
    if (!newItem.name || !newItem.price) {
      throw new Error('Informações do item incompletas');
    }

    // Resto da lógica de adição ao pedido...
    const orderPath = selectedOrder?.id 
      ? `tables/${selectedTable}/currentOrder/${selectedOrder.id}`
      : `tables/${selectedTable}/currentOrder`;

    const orderRef = ref(database, orderPath);
    
    if (selectedOrder?.id) {
      const updatedItems = [...(selectedOrder.items || []), newItem];
      await update(orderRef, {
        items: updatedItems,
        updatedAt: Date.now()
      });
      
      setSelectedOrder(prev => ({
        ...prev,
        items: updatedItems
      }));
    } else {
      const newOrder = {
        id: '',
        items: [newItem],
        status: 'open',
        createdAt: Date.now(),
        updatedAt: Date.now(),
        tableId: selectedTable
      };
      
      const newOrderRef = push(orderRef);
      await set(newOrderRef, {
        ...newOrder,
        id: newOrderRef.key
      });
      
      setSelectedOrder({
        ...newOrder,
        id: newOrderRef.key
      });

      const tableRef = ref(database, `tables/${selectedTable}`);
      await update(tableRef, {
        status: 'occupied'
      });
    }

    // Limpa os estados após adicionar
    setSelectedMenuItem(null);
    setNewItemQuantity(1);
    setItemNotes(prev => ({
      ...prev,
      [selectedMenuItem.id]: ''
    }));
    setSelectedFlavor('');
    
    // Rola para o topo do menu após adicionar item
    setTimeout(() => {
      const menuContainer = document.getElementById('menu-top');
      if (menuContainer) {
        menuContainer.scrollIntoView({ behavior: 'smooth' });
      }
    }, 300);

  } catch (err) {
    console.error("Erro ao adicionar item:", err);
    setError(err.message || "Falha ao adicionar item ao pedido");
  } finally {
    setLoading(false);
  }
}, [selectedTable, selectedMenuItem, selectedOrder, newItemQuantity, itemNotes, selectedFlavor]);



const removeItemFromOrder = useCallback(async (itemToRemove) => {
  if (!selectedTable || !selectedOrder?.id) return;

  try {
    setLoading(true);
    
    const orderRef = ref(database, `tables/${selectedTable}/currentOrder/${selectedOrder.id}`);
    const updatedItems = selectedOrder.items.filter(item => 
      !(item.id === itemToRemove.id && item.addedAt === itemToRemove.addedAt)
    );

    // Atualização otimista - atualiza UI primeiro
    setSelectedOrder(prev => ({
      ...prev,
      items: updatedItems
    }));

    await update(orderRef, {
      items: updatedItems,
      updatedAt: Date.now()
    });

    // Se não houver mais itens, fecha automaticamente
    if (updatedItems.length === 0) {
      const tableRef = ref(database, `tables/${selectedTable}`);
      await update(tableRef, {
        status: 'available'
      });
      
      // Remove o pedido atual
      await remove(orderRef);
      
      // Atualiza o estado local
      setTables(prevTables => prevTables.map(t => 
        t.id === selectedTable ? {...t, currentOrder: null, status: 'available'} : t
      ));
      
      setSelectedOrder(null);
      setShowTableDetailsModal(false);
    }

  } catch (error) {
    console.error("Erro ao deletar item:", error);
    setError("Falha ao remover item");
    
    // Reverte a UI em caso de erro
    if (selectedOrder) {
      setSelectedOrder(prev => prev);
    }
  } finally {
    setLoading(false);
  }
}, [selectedTable, selectedOrder]);

  // Função para atualizar quantidade do item
const updateItemQuantity = useCallback(async (itemId, newQuantity) => {
  if (!selectedTable || !selectedOrder?.items || newQuantity < 1) return;
  
  // Atualização otimista da UI
  const updatedItems = selectedOrder.items.map(item => 
    item.id === itemId ? { ...item, quantity: newQuantity } : item
  );
  
  setSelectedOrder(prev => ({
    ...prev,
    items: updatedItems
  }));

  try {
    const orderRef = ref(database, `tables/${selectedTable}/currentOrder/${selectedOrder.id}`);
    await update(orderRef, {
      items: updatedItems,
      updatedAt: Date.now()
    });
  } catch (err) {
    // Reverter em caso de erro
    setSelectedOrder(prev => ({
      ...prev,
      items: selectedOrder.items
    }));
    setError(`Falha ao atualizar quantidade: ${err.message}`);
  }
}, [selectedTable, selectedOrder]);

  // Função simplificada para fechar pedido
const closeOrder = useCallback(async () => {
  if (!selectedTable || !selectedOrder?.id) return;
  
  setIsClosingOrder(true);
  try {
    const table = tables.find(t => t.id === selectedTable);
    let total = calculateOrderTotal(selectedOrder);
    
    if (selectedOrder.items?.length === 0) {
      throw new Error('Não é possível fechar um pedido sem itens');
    }
    
    let deliveryFee = 0;
    
    if (table?.type === 'comanda' && selectedOrder.deliveryAddress) {
      deliveryFee = 2.50;
      total += deliveryFee;
    }

    const orderToClose = {
      ...selectedOrder,
      total: total,
      deliveryFee: deliveryFee,
      paymentMethod: paymentMethod,
      closedAt: Date.now(),
      closedBy: getAuth().currentUser?.email || 'admin',
      status: 'closed',
      tableType: table?.type || 'comanda' // Adiciona o tipo para o histórico
    };

    // Adicionar ao histórico no Firebase
    const historyRef = ref(database, `tables/${selectedTable}/ordersHistory`);
    const newHistoryRef = push(historyRef);
    await set(newHistoryRef, orderToClose);

    // Atualizar o estado local do histórico
    setOrderHistory(prev => [
      {
        ...orderToClose,
        id: newHistoryRef.key,
        tableId: selectedTable
      },
      ...prev // Adiciona no início do array
    ]);

    // Remover pedido atual
    const orderRef = ref(database, `tables/${selectedTable}/currentOrder/${selectedOrder.id}`);
    await remove(orderRef);
    
    // Atualizar status da mesa/comanda
    const tableRef = ref(database, `tables/${selectedTable}`);
    await update(tableRef, {
      status: 'available'
    });
    
    // Atualizar estado local das mesas
    setTables(prevTables => prevTables.map(table => {
      if (table.id === selectedTable) {
        return {
          ...table,
          currentOrder: null,
          status: 'available'
        };
      }
      return table;
    }));
    
    setSelectedOrder(null);
    setShowTableDetailsModal(false);
    setDeliveryAddress('');
  } catch (error) {
    console.error("Erro ao fechar comanda:", error);
    setError(error.message || 'Erro ao fechar comanda');
  } finally {
    setIsClosingOrder(false);
  }
}, [selectedTable, selectedOrder, tables, paymentMethod]);

  // Função para carregar histórico de pedidos
const loadOrderHistory = useCallback(async () => {
  setHistoryLoading(true);
  try {
    const historyRef = ref(database, 'tables');
    const snapshot = await get(historyRef);
    const data = snapshot.val() || {};
    
    let allOrders = [];
    
    Object.entries(data).forEach(([tableId, tableData]) => {
      if (tableData.ordersHistory) {
        Object.entries(tableData.ordersHistory).forEach(([orderId, order]) => {
          if (order.status === 'closed' || (order.total && order.total > 0)) {
            allOrders.push({
              ...order,
              id: orderId,
              tableId: tableId,
              tableType: tables.find(t => t.id === tableId)?.type || 'comanda',
              closedAt: order.closedAt || Date.now()
            });
          }
        });
      }
    });
    
    // Ordenar por data de fechamento (mais recente primeiro)
    allOrders.sort((a, b) => b.closedAt - a.closedAt);
    
    setOrderHistory(allOrders);
    setShowHistoryModal(true);
  } catch (err) {
    console.error("Erro ao carregar histórico:", err);
    setError('Erro ao carregar histórico de pedidos');
  } finally {
    setHistoryLoading(false);
  }
}, [tables]);

  // Função para filtrar histórico
const filteredHistory = useCallback(() => {
  let filtered = orderHistory;

  // Filtro por tipo (mesa/comanda)
  if (historyFilter !== 'all') {
    filtered = filtered.filter(order => 
      historyFilter === 'tables' 
        ? order.tableType !== 'comanda' 
        : order.tableType === 'comanda'
    );
  }

  // Filtro por termo de busca - MODIFICAÇÃO AQUI
  if (historySearchTerm) {
    const term = historySearchTerm.trim();
    filtered = filtered.filter(order => 
      order.tableId === term || // Busca exata pelo número da mesa/comanda
      order.items?.some(item => 
        item.name.toLowerCase().includes(term.toLowerCase()) ||
        (item.description && item.description.toLowerCase().includes(term.toLowerCase()))
    ));
  }

  // Filtro por data
  filtered = filtered.filter(order => {
    const orderDate = new Date(order.closedAt);
    return (
      orderDate >= historyDateRange.start &&
      orderDate <= historyDateRange.end
    );
  });

  return filtered;
}, [orderHistory, historyFilter, historySearchTerm, historyDateRange]);

  // Função para calcular total do pedido
  const calculateOrderTotal = useCallback((order) => {
    if (!order?.items) return 0;
    return order.items.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
  }, []);

  // Função para selecionar mesa
const handleTableSelect = useCallback(async (tableId) => {
  // 1. Atualização imediata do estado local
  setSelectedTable(tableId);
  setShowTableDetailsModal(true);

  // 2. Busca os dados em segundo plano
  try {
    const tableRef = ref(database, `tables/${tableId}/currentOrder`);
    const snapshot = await get(tableRef);

    if (snapshot.exists()) {
      const orderData = snapshot.val();
      const orderKey = Object.keys(orderData)[0];
      await update(ref(database, `tables/${tableId}/currentOrder/${orderKey}`), {
        lastViewedAt: Date.now()
      });
      const loadedOrder = {
        id: orderKey,
        ...orderData[orderKey],
        items: orderData[orderKey].items?.map(item => ({
          ...item,
          notes: item.notes || ''
        })) || []
      };
      
      // Atualiza o estado com os dados frescos
      setSelectedOrder(loadedOrder);
    } else {
      setSelectedOrder(null);
    }
  } catch (error) {
    console.error("Erro ao carregar mesa:", error);
  }

  // 3. Limpa notificações
  setTablesWithNewItems(prev => {
    const newState = {...prev};
    delete newState[tableId];
    return newState;
  });
}, []);

const optimizedUpdate = async (path, data) => {
  const ref = database.ref(path);
  await ref.update({
    ...data,
    _updatedAt: Date.now() // Campo extra para sincronização
  });
};

  // Função para verificar itens não impressos
const hasUnprintedItems = useCallback((order) => {
  if (!order?.items) return false;
  return order.items.some(item => !item.printed); // Verifica apenas o campo printed do item
}, []);

  // Função para filtrar mesas
  const filteredTables = useCallback(() => {
    switch (activeTab) {
      case 'active':
        return tables.filter(t => t.currentOrder);
      case 'vip':
        return tables.filter(t => {
          const total = t.currentOrder ? calculateOrderTotal(t.currentOrder) : 0;
          return total > 100;
        });
      case 'internas':
        return tables.filter(t => t.type === 'interna');
      case 'externas':
        return tables.filter(t => t.type === 'externa');
      case 'comandas':
        return tables.filter(t => t.type === 'comanda');
      default:
        return tables;
    }
  }, [activeTab, tables, calculateOrderTotal]);

  // Paginação de mesas
  const tablesPerPage = 12;
  const paginatedTables = useCallback(() => {
    const start = currentPage * tablesPerPage;
    return filteredTables().slice(start, start + tablesPerPage);
  }, [currentPage, filteredTables]);

  const totalPages = Math.ceil(filteredTables().length / tablesPerPage);

  // Função para obter cor do badge da mesa
  const getTableBadgeColor = useCallback((table) => {
    if (table.currentOrder) {
      return 'bg-red-100 text-red-800';
    }
    return 'bg-green-100 text-green-800';
  }, []);

  // Função para obter ícone da mesa
  const getTableIcon = useCallback((table) => {
    if (table.type === 'interna') return '🏠';
    if (table.type === 'externa') return '🌿';
    if (table.type === 'comanda') return '📋';
    return '🪑';
  }, []);

  // Função para login
  const handleLogin = useCallback(async (e) => {
    e.preventDefault();
    setIsLoadingAuth(true);
    setAuthError('');
    
    try {
      const auth = getAuth();
      await signInWithEmailAndPassword(auth, email, password);
      setIsAuthenticated(true);
    } catch (error) {
      setAuthError('Credenciais inválidas. Por favor, tente novamente.');
      console.error('Login error:', error);
    } finally {
      setIsLoadingAuth(false);
    }
  }, [email, password]);

  // Renderização do login
  const renderLogin = () => (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Painel Administrativo</h1>
          <p className="text-gray-600">Faça login para acessar o sistema</p>
        </div>
        
        {authError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {authError}
          </div>
        )}
        
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 mb-2">Usuário</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="admin@example.com"
              required
            />
          </div>
          
          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-700 mb-2">Senha</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="••••••••"
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={isLoadingAuth}
            className="w-full bg-gradient-to-br from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-colors font-medium flex items-center justify-center gap-2"
          >
            {isLoadingAuth ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Carregando...
              </>
            ) : (
              'Entrar'
            )}
          </button>
        </form>
      </div>
    </div>
  );

const renderNewOrdersPanel = () => {
  const newOrdersList = tables.filter(table => 
    newOrders[table.id] && table.currentOrder
  ).sort((a, b) => newOrders[b.id] - newOrders[a.id]);

  if (newOrdersList.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-40">
      <div className="bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden w-72">
        <div className="bg-gradient-to-r from-red-600 to-amber-600 text-white px-4 py-3 flex items-center justify-between">
          <h3 className="font-bold flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            Novos Pedidos
          </h3>
          <button 
            onClick={() => {
              setNewOrders({});
              setFlashingTables({});
            }}
            className="text-white/80 hover:text-white p-1 rounded-full"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="max-h-64 overflow-y-auto">
          {newOrdersList.map(table => (
            <div 
              key={table.id}
              onClick={() => {
                handleTableSelect(table.id);
                markOrderAsViewed(table.id);
              }}
              className="p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors"
            >
              <div className="flex justify-between items-center">
                <div className="font-medium">
                  {table.type === 'comanda' ? `Comanda ${table.id}` : `Mesa ${table.id}`}
                </div>
                <div className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                  {table.currentOrder.items?.length || 0} itens
                </div>
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {new Date(table.currentOrder.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

  // Renderização do cabeçalho
  const renderHeader = () => (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
      <div className="container mx-auto px-4 py-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white p-2 rounded-lg shadow-md">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">Painel Administrativo</h1>
              <p className="text-xs text-gray-500">Controle total das comandas</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden md:block text-sm text-gray-500">
              Atualizado: {lastUpdate.toLocaleTimeString()}
            </div>
            
<div className="flex items-center gap-2 md:gap-4">
  {/* Botão Conectar Impressora */}
  <button 
    onClick={connectToPrinter}
    className={`relative px-3 py-1.5 md:px-4 md:py-2 rounded-lg flex items-center gap-1 md:gap-2 text-xs md:text-sm font-medium ${
      printerConnected 
        ? 'bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-md' 
        : 'bg-gradient-to-br from-gray-700 to-gray-800 text-white hover:from-gray-800 hover:to-gray-900 shadow-md'
    } transition-all duration-200 min-w-[120px] md:min-w-[140px] justify-center`}
  >
    {printerConnected ? (
      <>
        <div className="w-2 h-2 rounded-full bg-white"></div>
        <span>Conectada</span>
      </>
    ) : (
      <>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
        <span>Conectar</span>
      </>
    )}
  </button>
  
  {/* Botão Pedidos */}
  <button
    onClick={() => setShowPendingOrdersModal(true)}
    disabled={!hasPendingItems}
    className={`relative px-3 py-1.5 md:px-4 md:py-2 rounded-lg flex items-center gap-1 md:gap-2 text-xs md:text-sm font-medium min-w-[100px] md:min-w-[120px] justify-center ${
      isPedidosButtonFlashing 
        ? 'animate-pulse-fast bg-gradient-to-br from-amber-500 to-amber-600 text-white shadow-md ring-2 ring-amber-300 ring-offset-1' 
        : hasPendingItems
          ? 'bg-gradient-to-br from-amber-500 to-amber-600 text-white shadow-md hover:from-amber-600 hover:to-amber-700'
          : 'bg-gradient-to-br from-gray-300 to-gray-400 text-gray-600 cursor-not-allowed'
    } transition-all duration-200`}
  >
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
    </svg>
    <span>Pedidos</span>
    {hasPendingItems && (
      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-bounce">
        {Object.values(pendingItemsByTable).reduce((sum, table) => sum + table.items.length, 0)}
      </span>
    )}
  </button>
  
  {/* Botão Histórico */}
  <button
    onClick={loadOrderHistory}
    className="px-3 py-1.5 md:px-4 md:py-2 rounded-lg flex items-center gap-1 md:gap-2 text-xs md:text-sm font-medium bg-gradient-to-br from-purple-600 to-indigo-600 text-white shadow-md hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 min-w-[100px] md:min-w-[120px] justify-center"
  >
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
    </svg>
    <span>Histórico</span>
  </button>
</div>
          </div>
        </div>
      </div>
    </header>
  );

  // Renderização das abas de mesas
const renderTableTabs = () => (
  <div className="bg-white border-r border-gray-200 md:h-[calc(100vh-4rem)] md:sticky md:top-16 overflow-y-auto">
    <div className="p-4 border-b border-gray-200 sticky top-0 bg-white z-10">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">Mesas & Comandas</h2>
          <p className="text-sm text-gray-500">Total: {tables.length} disponíveis</p>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-full">
            {tables.filter(t => t.currentOrder).length} ativas
          </span>
        </div>
      </div>
      
      <div className="flex space-x-2 mt-3 overflow-x-auto pb-2">
        {['all', 'active', 'vip', 'internas', 'externas', 'comandas'].map((tab) => (
          <button
            key={tab}
            onClick={() => { setActiveTab(tab); setCurrentPage(0); }}
            className={`px-3 py-1 text-sm rounded-full whitespace-nowrap ${
              activeTab === tab 
                ? tab === 'all' ? 'bg-blue-100 text-blue-800 font-medium' :
                  tab === 'active' ? 'bg-green-100 text-green-800 font-medium' :
                  tab === 'vip' ? 'bg-amber-100 text-amber-800 font-medium' :
                  tab === 'internas' ? 'bg-blue-100 text-blue-800 font-medium' :
                  tab === 'externas' ? 'bg-green-100 text-green-800 font-medium' :
                  'bg-purple-100 text-purple-800 font-medium'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {tab === 'all' ? 'Todas' :
             tab === 'active' ? 'Ativas' :
             tab === 'vip' ? 'VIP' :
             tab === 'internas' ? 'Internas' :
             tab === 'externas' ? 'Externas' : 'Comandas'}
          </button>
        ))}
      </div>
    </div>
    
    <div className="p-3">
      {paginatedTables().length > 0 ? (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {paginatedTables().map((table) => {
              const hasOrder = table.currentOrder;
              const orderTotal = hasOrder ? calculateOrderTotal(table.currentOrder) : 0;
              const isVIP = orderTotal > 100;
              const badgeColor = hasOrder ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800';
              const tableIcon = table.type === 'interna' ? '🏠' : 
                               table.type === 'externa' ? '🌿' : 
                               table.type === 'comanda' ? '📋' : '🪑';
              
              return (
           <button
                key={table.id}
                onClick={() => handleTableSelect(table.id)}
                className={`relative p-3 rounded-xl transition-all duration-200 ${
                  selectedTable === table.id 
                    ? 'bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 shadow-inner' 
                    : 'bg-white border border-gray-200 hover:border-blue-100 hover:shadow-sm'
                } flex flex-col items-center justify-center h-full min-h-[100px] ${
                  tablesWithNewItems[table.id] ? 'animate-pulse border-2 border-amber-400' : ''
                }`}
              >
                {tablesWithNewItems[table.id] && (
                  <div className="absolute top-0 left-0 transform -translate-y-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-500 to-yellow-500 text-white text-xs px-2 py-1 rounded-full flex items-center shadow-lg z-10">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Novo Item!
                  </div>
                )}
                
                <div className={`absolute top-1 right-1 ${hasOrder ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'} text-xs px-2 py-0.5 rounded-full flex items-center`}>
                  {hasOrder ? 'Ocupada' : 'Disponível'}
                </div>
                
                {isVIP && hasOrder && (
                  <div className="absolute top-1 left-1 bg-gradient-to-r from-amber-500 to-amber-600 text-white text-xs px-2 py-0.5 rounded-full flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    VIP
                  </div>
                )}
                
                <span className="font-bold text-gray-800 text-lg mb-1">
                  {table.type === 'comanda' ? `Comanda ${table.id}` : `Mesa ${table.id}`}
                </span>
                
                {hasOrder ? (
                  <div className="text-center">
                    <div className="text-xs text-gray-500">
                      {table.currentOrder.items?.length || 0} itens
                    </div>
                    <div className="text-sm font-semibold mt-1 text-blue-600">
                      € {orderTotal.toFixed(2)}
                    </div>
                  </div>
                ) : (
                  <span className="text-xs text-gray-400">Disponível</span>
                )}
              </button>
              );
            })}
          </div>
          
          {totalPages > 1 && (
            <div className="flex justify-center items-center mt-4 gap-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
                disabled={currentPage === 0}
                className="p-2 rounded-full bg-gray-100 disabled:opacity-50 hover:bg-gray-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              <span className="text-sm text-gray-600">
                Página {currentPage + 1} de {totalPages}
              </span>
              
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages - 1, p + 1))}
                disabled={currentPage >= totalPages - 1}
                className="p-2 rounded-full bg-gray-100 disabled:opacity-50 hover:bg-gray-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-8 text-gray-500">
          Nenhuma mesa encontrada com este filtro
        </div>
      )}
    </div>
  </div>
);
const renderPendingItemsModal = () => {
  if (!showPendingOrdersModal) return null;


  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col border border-white/20">
        {/* Header */}
        <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-md p-4 border-b border-white/10">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <span className="bg-gradient-to-r from-amber-500 to-amber-600 text-white p-2 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </span>
                <span>Pedidos Pendentes</span>
                {!allMarked && hasPendingItems && (
                  <span className="bg-red-500 text-white text-xs font-bold rounded-full px-2 py-1 ml-2 animate-pulse">
                    {Object.values(pendingItemsByTable).reduce((sum, table) => sum + table.items.length, 0)} itens
                  </span>
                )}
              </h2>
              <p className="text-xs text-gray-500 mt-1">Atualizado em tempo real</p>
            </div>
            <button 
              onClick={() => {
                setShowPendingOrdersModal(false);
                setAllMarked(false);
              }}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-500 hover:text-gray-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Corpo do Modal */}
        <div className="flex-1 overflow-y-auto">
          {allMarked || !hasPendingItems ? (
            <div className="flex flex-col items-center justify-center p-8 text-center">
              <div className="bg-green-100 p-6 rounded-full mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">Tudo em dia!</h3>
              <p className="text-gray-500 max-w-md mx-auto mb-6">
                Nenhum item pendente no momento. Novos pedidos aparecerão aqui automaticamente.
              </p>
              <button
                onClick={() => {
                  setShowPendingOrdersModal(false);
                  setAllMarked(false);
                }}
                className="px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-colors"
              >
                Voltar ao painel
              </button>
            </div>
          ) : (
            <div className="divide-y divide-gray-100/50">
              {Object.values(pendingItemsByTable).map((tableData) => (
                <div key={tableData.tableId} className="group">
                  <div className="sticky top-0 z-10 bg-gray-50/80 backdrop-blur-sm px-4 py-3 border-b border-gray-200/50 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${
                        tableData.tableType === 'comanda' 
                          ? 'bg-purple-100 text-purple-600' 
                          : 'bg-blue-100 text-blue-600'
                      }`}>
                        {tableData.tableType === 'comanda' ? '📋' : '🍽️'}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800">
                          {tableData.tableType === 'comanda' ? `Comanda ${tableData.tableId}` : `Mesa ${tableData.tableId}`}
                        </h3>
                        <p className="text-xs text-gray-500">
                          {tableData.items.length} {tableData.items.length > 1 ? 'itens' : 'item'}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={async () => await markAllItemsAsPrinted(tableData.tableId)}
                      className="text-xs bg-white border border-gray-200 px-3 py-1 rounded-full hover:bg-gray-50 transition-colors flex items-center gap-1"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Marcar todos
                    </button>
                  </div>

                  <div className="p-4 grid grid-cols-1 gap-3">
                    {tableData.items.map((item) => (
                      <div 
                        key={`${item.id}-${item.addedAt}`}
                        className="bg-white rounded-xl border border-gray-100 shadow-xs hover:shadow-sm transition-shadow overflow-hidden"
                      >
                        <div className="flex">
                          <div className="w-16 h-16 bg-gray-100 flex-shrink-0">
                            {item.image && (
                              <img 
                                src={item.image} 
                                alt={item.name}
                                className="w-full h-full object-cover"
                              />
                            )}
                          </div>
                          
                          <div className="flex-1 p-3">
                            <div className="flex justify-between items-start">
                              <h4 className="font-medium text-gray-800">{item.name}</h4>
                              <span className="bg-amber-100 text-amber-800 text-xs font-bold px-2 py-1 rounded-full">
                                {item.quantity}x
                              </span>
                            </div>
                            
                            {item.notes && (
                              <div className="mt-1 text-xs bg-gray-50 text-gray-600 px-2 py-1 rounded">
                                <span className="font-medium">Obs:</span> {item.notes}
                              </div>
                            )}
                            
                            <div className="mt-2 flex justify-between items-center">
                              <span className="text-xs text-gray-400">
                                {new Date(item.addedAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                              </span>
                              <button
                                onClick={async () => {
                                  const orderRef = ref(database, `tables/${tableData.tableId}/currentOrder`);
                                  const snapshot = await get(orderRef);
                                  if (snapshot.exists()) {
                                    const orderKey = Object.keys(snapshot.val())[0];
                                    const order = snapshot.val()[orderKey];
                                    
                                    const updatedItems = order.items.map(i => 
                                      i.id === item.id && i.addedAt === item.addedAt 
                                        ? {...i, printed: true} 
                                        : i
                                    );
                                    
                                    await update(ref(database, `tables/${tableData.tableId}/currentOrder/${orderKey}`), {
                                      items: updatedItems
                                    });
                                    
                                    setPendingItemsByTable(prev => {
                                      const newState = {...prev};
                                      newState[tableData.tableId].items = newState[tableData.tableId].items.filter(
                                        i => !(i.id === item.id && i.addedAt === item.addedAt)
                                      );
                                      if (newState[tableData.tableId].items.length === 0) {
                                        delete newState[tableData.tableId];
                                      }
                                      return newState;
                                    });
                                  }
                                }}
                                className="text-xs bg-gradient-to-r from-green-500 to-emerald-600 text-white px-3 py-1.5 rounded-lg hover:from-green-600 hover:to-emerald-700 transition-colors flex items-center gap-1"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                Pronto
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {hasPendingItems && !allMarked && (
          <div className="sticky bottom-0 bg-white/90 backdrop-blur-sm border-t border-gray-200/50 p-3">
            <button
              onClick={handleMarkAll}
              className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-lg hover:from-amber-600 hover:to-amber-700 transition-colors font-medium flex items-center justify-center gap-2 shadow-md"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Marcar todos como preparados
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
  // Renderização do modal de histórico (VERSÃO PREMIUM MELHORADA)
const renderHistoryModal = () => {
  const filteredOrders = filteredHistory();
  const totalRevenue = filteredOrders.reduce((sum, order) => sum + (order.total || calculateOrderTotal(order)), 0);
  const averageOrderValue = filteredOrders.length > 0 ? totalRevenue / filteredOrders.length : 0;
  const topItems = {};
  const topCustomers = {};
  const revenueByPaymentMethod = {
    dinheiro: 0,
    cartao: 0
  };

  filteredOrders.forEach(order => {
    // Contagem de itens
    order.items?.forEach(item => {
      const key = `${item.name}-${item.price.toFixed(2)}`;
      topItems[key] = (topItems[key] || 0) + (item.quantity || 1);
    });
    
    // Clientes frequentes (para comandas com endereço)
    if (order.tableType === 'comanda' && order.deliveryAddress) {
      topCustomers[order.deliveryAddress] = (topCustomers[order.deliveryAddress] || 0) + 1;
    }

    // Receita por método de pagamento
    if (order.paymentMethod === 'dinheiro') {
      revenueByPaymentMethod.dinheiro += order.total || calculateOrderTotal(order);
    } else {
      revenueByPaymentMethod.cartao += order.total || calculateOrderTotal(order);
    }
  });

  const sortedTopItems = Object.entries(topItems)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const sortedTopCustomers = Object.entries(topCustomers)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="sticky top-0 bg-white z-10 p-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-xl font-bold text-gray-800">Histórico de Pedidos</h3>
          <button 
            onClick={() => setShowHistoryModal(false)}
            className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
          {/* Filtros e estatísticas */}
          <div className="w-full md:w-72 bg-gray-50 border-b md:border-b-0 md:border-r border-gray-200 p-4 overflow-y-auto">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => setHistoryFilter('all')}
                    className={`py-1 px-2 rounded-lg text-xs sm:text-sm ${
                      historyFilter === 'all' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    Todos
                  </button>
                  <button
                    onClick={() => setHistoryFilter('tables')}
                    className={`py-1 px-2 rounded-lg text-xs sm:text-sm ${
                      historyFilter === 'tables' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    Mesas
                  </button>
                  <button
                    onClick={() => setHistoryFilter('comandas')}
                    className={`py-1 px-2 rounded-lg text-xs sm:text-sm ${
                      historyFilter === 'comandas' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    Comandas
                  </button>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Período</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs text-gray-500 block mb-1">De</label>
                    <input
                      type="date"
                      value={historyDateRange.start.toISOString().split('T')[0]}
                      onChange={(e) => setHistoryDateRange(prev => ({
                        ...prev,
                        start: new Date(e.target.value)
                      }))}
                      className="w-full px-2 py-1 sm:px-3 sm:py-2 border border-gray-300 rounded-lg text-xs sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 block mb-1">Até</label>
                    <input
                      type="date"
                      value={historyDateRange.end.toISOString().split('T')[0]}
                      onChange={(e) => setHistoryDateRange(prev => ({
                        ...prev,
                        end: new Date(e.target.value)
                      }))}
                      className="w-full px-2 py-1 sm:px-3 sm:py-2 border border-gray-300 rounded-lg text-xs sm:text-sm"
                    />
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pesquisar</label>
                <input
                  type="text"
                  placeholder="Mesa, item, etc."
                  value={historySearchTerm}
                  onChange={(e) => setHistorySearchTerm(e.target.value)}
                  className="w-full px-2 py-1 sm:px-3 sm:py-2 border border-gray-300 rounded-lg text-xs sm:text-sm"
                />
              </div>
              
              <div className="bg-white rounded-lg p-3 sm:p-4 shadow-sm border border-gray-200">
                <h4 className="font-medium text-gray-700 mb-2 sm:mb-3">Estatísticas</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-blue-50 p-2 rounded-lg">
                    <div className="text-xs text-blue-600">Pedidos</div>
                    <div className="text-lg font-bold">{filteredOrders.length}</div>
                  </div>
                  <div className="bg-purple-50 p-2 rounded-lg">
                    <div className="text-xs text-purple-600">Ticket Médio</div>
                    <div className="text-lg font-bold">€ {averageOrderValue.toFixed(2)}</div>
                  </div>
                </div>
              </div>
              
              {sortedTopItems.length > 0 && (
                <div className="bg-white rounded-lg p-3 sm:p-4 shadow-sm border border-gray-200">
                  <h4 className="font-medium text-gray-700 mb-2 sm:mb-3">Itens mais vendidos</h4>
                  <div className="space-y-2">
                    {sortedTopItems.map(([item, quantity]) => {
                      const [name, price] = item.split('-');
                      return (
                        <div key={item} className="flex justify-between text-xs sm:text-sm">
                          <div className="truncate flex-1">{name}</div>
                          <div className="font-medium ml-2">{quantity}x</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
              
              {sortedTopCustomers.length > 0 && (
                <div className="bg-white rounded-lg p-3 sm:p-4 shadow-sm border border-gray-200">
                  <h4 className="font-medium text-gray-700 mb-2 sm:mb-3">Clientes frequentes</h4>
                  <div className="space-y-2">
                    {sortedTopCustomers.map(([address, orders]) => (
                      <div key={address} className="text-xs sm:text-sm">
                        <div className="font-medium truncate">{address}</div>
                        <div className="text-gray-500 text-xs">{orders} pedidos</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Lista de pedidos */}
          <div className="flex-1 overflow-y-auto">
            {historyLoading ? (
              <div className="flex justify-center items-center py-12">
                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : filteredOrders.length > 0 ? (
              <div className="divide-y divide-gray-200">
                {filteredOrders.map((order) => {
                  const orderTotal = order.total || calculateOrderTotal(order);
                  const isDelivery = order.tableType === 'comanda' && order.deliveryAddress;
                  
                  return (
                    <div key={order.id} className="p-3 sm:p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-2">
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className={`inline-block px-2 py-1 rounded-full text-xs ${
                              order.tableType === 'comanda' 
                                ? 'bg-purple-100 text-purple-800' 
                                : 'bg-blue-100 text-blue-800'
                            }`}>
                              {order.tableType === 'comanda' ? `Comanda ${order.tableId}` : `Mesa ${order.tableId}`}
                            </span>
                            <span className="text-xs text-gray-500">
                            {order.closedAt 
                              ? new Date(order.closedAt).toLocaleString('pt-PT', {
                                  day: '2-digit',
                                  month: '2-digit',
                                  year: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })
                              : '--/--/---- --:--'}
                          </span>
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            Fechado por: <span className="font-medium">{order.closedBy || 'Sistema'}</span>
                          </div>
                        </div>
                        <div className="sm:text-right">
                          <div className="text-lg font-bold text-green-600">€ {orderTotal.toFixed(2)}</div>
                        </div>
                      </div>
                      
                      {isDelivery && (
                        <div className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded mb-2 inline-flex items-center gap-1">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                          </svg>
                          {order.deliveryAddress}
                        </div>
                      )}
                      
                      <div className="mt-2">
                        <div className="text-xs font-medium text-gray-500 mb-1">ITENS ({order.items?.length || 0})</div>
                        <div className="space-y-2">
                          {order.items?.map(item => (
                            <div key={`${order.id}-${item.id}-${item.addedAt}`} className="flex justify-between text-xs sm:text-sm">
                              <div className="flex items-start gap-2">
                                <span className="text-gray-500">{item.quantity}x</span>
                                <div>
                                  <div>{item.name}</div>
                                  {item.notes && (
                                    <div className="text-xs text-gray-500">Obs: {item.notes}</div>
                                  )}
                                </div>
                              </div>
                              <div className="text-gray-700 font-medium">
                                € {(item.price * (item.quantity || 1)).toFixed(2)}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <h3 className="text-lg font-medium text-gray-700 mt-2">Nenhum pedido encontrado</h3>
                <p className="mt-1 text-sm">Ajuste os filtros para ver os resultados</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

  // Renderização do modal para adicionar itens (MODIFICADO)
  const renderAddItemModal = () => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 md:p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white z-10 p-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-xl font-bold text-gray-800">
            {selectedMenuItem ? selectedMenuItem.name : 'Adicionar Item'}
          </h3>
          <button 
            onClick={() => {
              setShowAddItemModal(false);
              setSelectedMenuItem(null);
              setSearchTerm('');
              setShowSearchResults(false);
              setSelectedFlavor('');
            }}
            className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {!selectedMenuItem ? (
          <div className="p-4">
            <div className="mb-4 relative">
              <input
                type="text"
                placeholder="Pesquisar item..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              
              {searchTerm && (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setShowSearchResults(false);
                  }}
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
            
            {/* Abas do menu */}
            <div 
              ref={menuCategoriesRef}
              className="flex space-x-2 mb-4 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
            >
              {Object.keys(menu).map(category => (
                <button
                  key={category}
                  onClick={() => {
                    setActiveMenuTab(category);
                    if (menuItemsRef.current) {
                      menuItemsRef.current.scrollTo({ top: 0, behavior: 'smooth' });
                    }
                  }}
                  className={`px-3 py-1 text-sm rounded-full whitespace-nowrap flex-shrink-0 ${
                    activeMenuTab === category 
                      ? 'bg-blue-100 text-blue-800 font-medium' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1).replace(/([A-Z])/g, ' $1')}
                </button>
              ))}
            </div>
            
            {showSearchResults ? (
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-700 mb-2">
                  Resultados para "{searchTerm}"
                </h4>
                <div 
                  ref={menuItemsRef}
                  className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[60vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
                >
                  {searchResults.map(item => (
                    <button
                      key={item.id}
                      onClick={() => setSelectedMenuItem(item)}
                      className="text-left p-3 bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all flex items-start gap-3 h-full"
                    >
                      <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                        {item.image && (
                          <img 
                            src={item.image} 
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-gray-800">{item.name}</div>
                        {item.description && (
                          <div className="text-xs text-gray-500 line-clamp-2 mt-1">{item.description}</div>
                        )}
                        <div className="text-blue-600 font-bold text-sm mt-2">€ {item.price.toFixed(2)}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-gray-700 mb-3 text-lg border-b border-gray-200 pb-2">
                    {activeMenuTab.charAt(0).toUpperCase() + activeMenuTab.slice(1).replace(/([A-Z])/g, ' $1')}
                  </h4>
                  <div 
                    ref={menuItemsRef}
                    className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[60vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
                  >
                    {menu[activeMenuTab]?.map(item => (
                      <button
                        key={item.id}
                        onClick={() => setSelectedMenuItem(item)}
                        className="text-left p-3 bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all flex items-start gap-3 h-full"
                      >
                        <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                          {item.image && (
                            <img 
                              src={item.image} 
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-gray-800">{item.name}</div>
                          {item.description && (
                            <div className="text-xs text-gray-500 line-clamp-2 mt-1">{item.description}</div>
                          )}
                          <div className="text-blue-600 font-bold text-sm mt-2">€ {item.price.toFixed(2)}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="p-4 md:p-6">
            <button
              onClick={() => {
                setSelectedMenuItem(null);
                setSearchTerm('');
                setShowSearchResults(false);
                setSelectedFlavor('');
              }}
              className="flex items-center text-blue-600 mb-4"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Voltar para o menu
            </button>
            
            <div className="flex flex-col md:flex-row gap-6 mb-6">
              <div className="w-full md:w-1/3">
                <div className="bg-gray-100 rounded-xl overflow-hidden aspect-square">
                  {selectedMenuItem.image && (
                    <img 
                      src={selectedMenuItem.image} 
                      alt={selectedMenuItem.name}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
              </div>
              
              <div className="flex-1">
                <h4 className="font-bold text-xl text-gray-800 mb-2">{selectedMenuItem.name}</h4>
                {selectedMenuItem.description && (
                  <p className="text-gray-600 mb-4">{selectedMenuItem.description}</p>
                )}
                
                {/* Seletor de sabores para Compal */}
                {selectedMenuItem.id === 'compal' && selectedMenuItem.flavorOptions && (
                  <div className="mb-6">
                    <label className="block text-gray-700 mb-2 font-medium">Sabor:</label>
                    <select
                      value={selectedFlavor}
                      onChange={(e) => setSelectedFlavor(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option value="">Selecione um sabor</option>
                      {selectedMenuItem.flavorOptions.map(flavor => (
                        <option key={flavor} value={flavor}>{flavor}</option>
                      ))}
                    </select>
                  </div>
                )}
                
                {/* Seletor de energéticos */}
                {selectedMenuItem.id === 'energeticos' && selectedMenuItem.options && (
                  <div className="mb-6">
                    <label className="block text-gray-700 mb-2 font-medium">Marca:</label>
                    <select
                      value={selectedFlavor}
                      onChange={(e) => setSelectedFlavor(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option value="">Selecione uma marca</option>
                      {selectedMenuItem.options.map(option => (
                        <option key={option.name} value={option.name}>{option.name} (€ {option.price.toFixed(2)})</option>
                      ))}
                    </select>
                  </div>
                )}
                
                {/* Seletor de refrigerantes */}
                {selectedMenuItem.id === 'refrigerantes-lata' && selectedMenuItem.flavorOptions && (
                  <div className="mb-6">
                    <label className="block text-gray-700 mb-2 font-medium">Sabor:</label>
                    <select
                      value={selectedFlavor}
                      onChange={(e) => setSelectedFlavor(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option value="">Selecione um sabor</option>
                      {selectedMenuItem.flavorOptions.map(flavor => (
                        <option key={flavor} value={flavor}>{flavor}</option>
                      ))}
                    </select>
                  </div>
                )}
                
                <div className="bg-gray-50 rounded-xl p-4 mb-6">
                  <label className="block text-gray-700 mb-3 font-medium">Quantidade:</label>
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => setNewItemQuantity(prev => Math.max(1, prev - 1))}
                      className="w-12 h-12 bg-white rounded-lg flex items-center justify-center hover:bg-gray-100 transition-colors border border-gray-300 text-xl"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      min="1"
                      value={newItemQuantity}
                      onChange={(e) => setNewItemQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      className="flex-1 text-center border border-gray-300 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg font-medium"
                    />
                    <button 
                      onClick={() => setNewItemQuantity(prev => prev + 1)}
                      className="w-12 h-12 bg-white rounded-lg flex items-center justify-center hover:bg-gray-100 transition-colors border border-gray-300 text-xl"
                    >
                      +
                    </button>
                  </div>
                </div>
                
                <div className="mb-6">
                  <label className="block text-gray-700 mb-2 font-medium">Observações:</label>
                  <textarea
                    value={itemNotes[selectedMenuItem.id] || ''}
                    onChange={(e) => setItemNotes(prev => ({
                      ...prev,
                      [selectedMenuItem.id]: e.target.value
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ex: Sem cebola, bem passado, etc."
                    rows={3}
                  />
                </div>
                
                <div className="flex justify-between items-center bg-gray-50 rounded-xl p-4 mb-6">
                  <span className="font-medium text-gray-700">Subtotal:</span>
                  <span className="text-xl font-bold text-blue-600">
                    € {(
                      (selectedMenuItem.id === 'energeticos' && selectedMenuItem.options && selectedFlavor 
                        ? selectedMenuItem.options.find(o => o.name === selectedFlavor)?.price || selectedMenuItem.price 
                        : selectedMenuItem.price
                      ) * newItemQuantity
                    ).toFixed(2)}
                  </span>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    onClick={() => {
                      setSelectedMenuItem(null);
                      setSearchTerm('');
                      setShowSearchResults(false);
                      setSelectedFlavor('');
                    }}
                    className="px-4 py-3 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-colors border border-gray-300 font-medium"
                  >
                    Cancelar
                  </button>
                              <button
                  onClick={addItemToOrder}
                  className={`px-4 py-3 bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-colors font-medium flex items-center justify-center gap-2 ${
                    ((selectedMenuItem.id === 'compal' || 
                      selectedMenuItem.id === 'refrigerantes-lata' || 
                      selectedMenuItem.id === 'energeticos') && !selectedFlavor) ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  disabled={loading || (
                    (selectedMenuItem.id === 'compal' || 
                    selectedMenuItem.id === 'refrigerantes-lata' || 
                    selectedMenuItem.id === 'energeticos') && 
                    !selectedFlavor
                  )}
                >
                  {loading ? (
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : null}
                  {selectedOrder?.id ? 'Adicionar ao Pedido' : 'Criar Novo Pedido'}
                </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
  // Renderização dos detalhes da mesa
  const renderTableDetailsModal = () => {
    const table = tables.find(t => t.id === selectedTable);
    const tableType = table?.type === 'comanda' ? 'Comanda' : 'Mesa';
    const tableName = `${tableType} ${selectedTable}`;
    const isDelivery = table?.type === 'comanda' && selectedOrder?.deliveryAddress;

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
          <div className="sticky top-0 bg-white z-10 p-4 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-xl font-bold text-gray-800">{tableName}</h3>
            <button 
              onClick={() => {
                setShowTableDetailsModal(false);
                setSelectedTable(null);
              }}
              className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="p-4 overflow-y-auto max-h-[calc(90vh-60px)]">
            {selectedOrder ? (
              <>
                {/* Seção de itens do pedido */}
                <div className="space-y-3 mb-6">
                  {selectedOrder.items?.length > 0 ? (
                    selectedOrder.items.map((item) => {
                      const isPrinted = item.printed;

                      return (
                        <div
                          key={`${item.id}-${item.addedAt || ''}`}
                          className={`flex flex-col sm:flex-row justify-between items-start sm:items-center p-3 rounded-lg border ${
                            isPrinted
                              ? 'bg-gray-50 border-gray-200'
                              : 'bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-200 shadow-sm'
                          } transition-all duration-200`}
                        >
                          <div className="flex items-center gap-3 mb-2 sm:mb-0 w-full sm:w-auto">
                            {!isPrinted && (
                              <span className="bg-gradient-to-r from-amber-500 to-yellow-500 text-white text-xs px-2 py-1 rounded-full whitespace-nowrap flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                                Novo!
                              </span>
                            )}
                            <div className="w-10 h-10 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                              {item.image && (
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="w-full h-full object-cover"
                                />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p
                                className={`font-medium ${
                                  isPrinted ? 'text-gray-600' : 'text-gray-800'
                                }`}
                              >
                                {item.name}
                              </p>
                              {item.description && (
                                <p className="text-xs text-gray-500 truncate">
                                  {item.description}
                                </p>
                              )}
                              {item.notes && (
                                <div className="text-xs text-gray-600 mt-1 bg-white px-2 py-1 rounded">
                                  <span className="font-semibold">Obs:</span> {item.notes}
                                </div>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between w-full sm:w-auto sm:gap-3">
                            <div className="flex items-center bg-white rounded-lg px-2 py-1 border border-gray-300">
                              <button
                                onClick={() =>
                                  updateItemQuantity(item.id, (item.quantity || 1) - 1)
                                }
                                className="text-gray-500 hover:text-blue-600 w-6 h-6 flex items-center justify-center"
                              >
                                -
                              </button>
                              <span className="text-sm font-medium w-6 text-center">
                                {item.quantity || 1}
                              </span>
                              <button
                                onClick={() =>
                                  updateItemQuantity(item.id, (item.quantity || 1) + 1)
                                }
                                className="text-gray-500 hover:text-blue-600 w-6 h-6 flex items-center justify-center"
                              >
                                +
                              </button>
                            </div>

                            <span className="text-blue-600 font-semibold min-w-[60px] text-right">
                              € {(item.price * (item.quantity || 1)).toFixed(2)}
                            </span>

                          <button
                            onClick={() => removeItemFromOrder(item)}
                            className="text-red-500 hover:text-red-700 p-1 sm:p-2 rounded-full hover:bg-red-50 transition-colors ml-2"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center py-8">
                      <div className="bg-gray-100 p-5 rounded-full inline-block mb-4">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-10 w-10 text-gray-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1}
                            d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                          />
                        </svg>
                      </div>
                      <h3 className="text-lg font-medium text-gray-700 mb-2">
                        Comanda vazia
                      </h3>
                      <p className="text-gray-500 mb-4">Adicione itens para começar</p>
                      <button
                        onClick={() => {
                          setShowAddItemModal(true);
                          setShowTableDetailsModal(false);
                        }}
                        className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-colors flex items-center gap-2 mx-auto"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                          />
                        </svg>
                        Adicionar Itens
                      </button>
                    </div>
                  )}
                </div>

                {selectedOrder.items?.length > 0 && (
                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-lg font-bold text-gray-800">Total:</span>
                      <span className="text-2xl font-bold text-blue-600">
                        € {(calculateOrderTotal(selectedOrder) + (isDelivery ? 2.50 : 0)).toFixed(2)}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <button
                          onClick={() => {
                            setShowAddItemModal(true);
                            setShowTableDetailsModal(false);
                          }}
                          className="bg-white text-blue-600 px-4 py-3 rounded-lg hover:bg-gray-50 transition-all hover:shadow-md flex items-center justify-center gap-2 border border-gray-200 font-medium"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                            />
                          </svg>
                          Adicionar Mais
                        </button>

                        <button
                        onClick={printOrder}
                        disabled={isPrinting || selectedOrder.items?.length === 0}
                        className={`px-4 py-3 rounded-lg transition-all hover:shadow-md flex items-center justify-center gap-2 font-medium ${
                          isPrinting || selectedOrder.items?.length === 0
                            ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                            : 'bg-gradient-to-br from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700'
                        }`}
                      >
                        {isPrinting ? (
                          <>
                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Imprimindo...
                          </>
                        ) : (
                          <>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                            </svg>
                            Enviar para Cozinha
                          </>
                        )}
                      </button>

                      <button
                        onClick={closeOrder}
                        disabled={isClosingOrder}
                        className="px-4 py-3 bg-gradient-to-br from-red-500 to-pink-500 text-white rounded-lg hover:from-red-600 hover:to-pink-600 transition-all hover:shadow-md flex items-center justify-center gap-2 font-medium"
                      >
                        {isClosingOrder ? (
                          <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                        Fechar Comanda
                      </button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-8">
                <div className="bg-gray-100 p-5 rounded-full inline-block mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-10 w-10 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-700 mb-2">
                  Nenhum pedido ativo
                </h3>
                <p className="text-gray-500 mb-4">Comece criando um novo pedido</p>
                <button
                  onClick={() => {
                    setShowAddItemModal(true);
                    setShowTableDetailsModal(false);
                  }}
                  className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-colors flex items-center gap-3 mx-auto text-lg"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                  Criar Novo Pedido
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Renderização do conteúdo principal
  const renderMainContent = () => (
    <div className="min-h-screen bg-gray-50">
      {/* Notificações */}
      {error && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-6 py-3 rounded-lg shadow-xl z-50 flex items-center animate-fade-in">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          {error}
          <button 
            onClick={() => setError(null)} 
            className="ml-4 p-1 rounded-full hover:bg-red-600 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      {/* Loader */}
      {(loading || isPrinting || isClosingOrder) && (
        <div className="fixed inset-0 bg-black/20 z-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl shadow-xl flex items-center gap-3">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="font-medium text-gray-700">Processando...</span>
          </div>
        </div>
      )}

      {renderHeader()}

      <div className="container mx-auto flex flex-col md:flex-row">
        {renderTableTabs()}
        
        <main className="flex-1 p-4 bg-gray-50 min-h-[calc(100vh-4rem)]">
          {!selectedTable && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center flex flex-col items-center justify-center h-[60vh]">
              <div className="bg-gray-100 p-6 rounded-full inline-block mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 5h18M3 12h18M3 19h18" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-700 mb-2">Selecione uma mesa ou comanda</h3>
              <p className="text-gray-500 mb-6 max-w-md">
                Escolha uma mesa ou comanda no painel lateral para visualizar e gerenciar os pedidos
              </p>
              <div className="w-12 h-1 bg-gray-200 rounded-full mb-6"></div>
              <p className="text-sm text-gray-400">
                Toque em uma mesa ou comanda para começar
              </p>
            </div>
          )}
        </main>
      </div>
  
      {/* Modais */}
      {showAddItemModal && renderAddItemModal()}
      {showHistoryModal && renderHistoryModal()}
      {showTableDetailsModal && renderTableDetailsModal()}
      {renderNewOrdersPanel()}
      {renderPendingItemsModal()}
    </div>
  );

  // Renderização condicional
  return !isAuthenticated ? renderLogin() : renderMainContent();

};

export default AdminPanel; 