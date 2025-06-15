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
// Importação do som de notificação
import notificationSound from '../assets/notification.mp3';

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
  const [printedItems, setPrintedItems] = useState({});
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
  const [sentItems, setSentItems] = useState({});
  const [historyDateRange, setHistoryDateRange] = useState({
    start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    end: new Date()
  });

  // Novos estados para notificação de pedidos via QR Code
  const [qrCodeOrders, setQrCodeOrders] = useState([]);
  const [showQrNotification, setShowQrNotification] = useState(false);
  const [currentQrOrder, setCurrentQrOrder] = useState(null);
  const audioRef = useRef(null);
  const notificationTimeoutRef = useRef(null);

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
    delayBetweenChunks: 100
  };

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
      { id: 11, name: 'Tosta Premium (Frango)', description: 'acompanha queijo, alface, tomate e cebola roxa', price: 6.50, image: foodImages.tostaspremium, rating: 4.0 },
      { id: 12, name: 'Tosta Premium (Atum)', description: 'acompanha queijo, alface, tomate e cebola roxa', price: 6.50, image: foodImages.tostaspremium, rating: 4.0 },
      { id: 13, name: 'Sanduíche Natural', description: 'Patê de frango, queijo, rúcula, tomate, cebola roxa e cenoura ralada', price: 6.50, image: foodImages.sanduichenatural, rating: 3.9 }
    ],
    porcoes: [
      { id: 14, name: 'Batata Frita', description: 'Porção com 400g de batata frita', price: 4.00, image: foodImages.fritascomqueijo, rating: 4.2 },
      { id: 15, name: 'Fritas com Bacon e Queijo', description: 'Porção com 400g de batatas com bacon e queijo cheddar', price: 6.50, image: foodImages.fritascomqueijo, rating: 4.6 },
      { id: 16, name: 'Chouriça com Cebola', description: 'Porção com 600g de chouriça acebolada e pão fatiado', price: 9.00, image: foodImages.chorica, rating: 4.5 },
      { id: 17, name: 'Asinha de Frango', description: 'Porção com 700g de asinhas de frango e molho barbecue', price: 12.00, image: foodImages.Asinha, rating: 4.4 },
      { id: 18, name: 'Costelinha', description: 'Porção com 800g de costelinha e molho barbecue', price: 12.00, image: foodImages.costelaporco, rating: 4.7 },
      { id: 19, name: 'Picanha com Fritas', description: 'Porção com 600g de tiras de picanha temperada com sal de parrilha e acompanhado de batata frita ou doce', price: 22.90, image: foodImages.Picanhacomfritas, rating: 4.8 },
      { id: 20, name: 'Filé de Tilápia', description: 'Porção com 800g de filé de tilápia e molho tartaro', price: 15.00, image: foodImages.Filetilapia, rating: 4.3 }
    ],
    pasteis: [
      { id: 21, name: 'Pastel Simples', description: 'Frango desfiado, carne picada ou queijo', price: 5.00, image: foodImages.pastelfeira, rating: 4.3 },
      { id: 22, name: 'Pastel de Frango com Queijo', description: 'Frango desfiado com queijo', price: 5.50, image: foodImages.pastelfeira, rating: 4.5 },
      { id: 23, name: 'Pastel de Frango com Queijo e Bacon', description: 'Frango desfiado com queijo e bacon em cubos', price: 6.50, image: foodImages.pastelfeira, rating: 4.7 },
      { id: 24, name: 'Pastel de Carne com Queijo', description: 'Carne picada com queijo e azeitona', price: 5.50, image: foodImages.pastelfeira, rating: 4.4 },
      { id: 25, name: 'Pastel de Carne com Queijo e Bacon', description: 'Carne picada com queijo, azeitona e bacon em cubos', price: 6.50, image: foodImages.pastelfeira, rating: 4.6 },
      { id: 26, name: 'Pastel de Chouriça', description: 'Queijo, chouriça e milho', price: 5.50, image: foodImages.pastelfeira, rating: 4.2 },
      { id: 27, name: 'Pastel Misto', description: 'Fiambre, queijo, azeitona e milho', price: 5.50, image: foodImages.pastelfeira, rating: 4.1 },
      { id: 28, name: 'Pastel de Pizza', description: 'Queijo, fiambre, tomate e orégano', price: 5.50, image: foodImages.pastelfeira, rating: 4.0 },
      { id: 29, name: 'Pastel Alto Astral', description: 'Queijo, bacon, tomate, azeitona, cheddar e orégano', price: 6.50, image: foodImages.pastelfeira, rating: 4.8 },
      { id: 30, name: 'Pastel Romeu e Julieta', description: 'Queijo com goiabada', price: 5.50, image: foodImages.pastelfeira, rating: 4.7 },
      { id: 31, name: 'Pastel de Banana com Nutella', description: 'Queijo, banana e nutella', price: 6.00, image: foodImages.pastelfeira, rating: 4.9 }
    ],
    cafe: [
      { id: 32, name: 'Café Expresso', price: 1.00, image: foodImages.cafe, rating: 4.5 },
      { id: 33, name: 'Café Descafeinado', price: 1.00, image: foodImages.cafe, rating: 4.3 },
      { id: 34, name: 'Café Duplo', price: 2.00, image: foodImages.cafe, rating: 4.6 },
      { id: 35, name: 'Garoto', price: 1.00, image: foodImages.Garoto, rating: 4.2 },
      { id: 36, name: 'Abatanado', price: 1.10, image: foodImages.abatanado, rating: 4.1 },
      { id: 37, name: 'Meia de Leite', price: 1.50, image: foodImages.meialeite, rating: 4.4 },
      { id: 38, name: 'Galão', price: 1.60, image: foodImages.galao, rating: 4.5 },
      { id: 39, name: 'Chá', price: 1.60, image: foodImages.cha, rating: 4.0 },
      { id: 40, name: 'Cappuccino', price: 3.00, image: foodImages.capuccino, rating: 4.7 },
      { id: 41, name: 'Carioca de Limão', price: 1.00, image: foodImages.cariocalimao, rating: 3.9 },
      { id: 42, name: 'Chocolate Quente', price: 3.00, image: foodImages.chocolatequente, rating: 4.8 },
      { id: 43, name: 'Torrada com Pão Caseiro', price: 2.00, image: foodImages.torradapaocaseiro, rating: 4.3 },
      { id: 44, name: 'Torrada com Pão de Forma', price: 1.50, image: foodImages.torradapaodeforma, rating: 4.1 },
      { id: 45, name: 'Meia Torrada', price: 1.00, image: foodImages.torradapaocaseiro, rating: 4.0 },
      { id: 46, name: 'Croissant Misto', price: 3.00, image: foodImages.croissanmisto, rating: 4.6 },
      { id: 47, name: 'Croissant Misto Tostado', price: 3.20, image: foodImages.croissant, rating: 4.7 },
      { id: 48, name: 'Tosta Mista', price: 3.20, image: foodImages.tosta, rating: 4.5 },
      { id: 49, name: 'Tosta Mista (Pão de Forma)', price: 2.80, image: foodImages.tostamistapaoforma, rating: 4.4 },
      { id: 50, name: 'Sandes Mista', price: 2.20, image: foodImages.sandesmista, rating: 4.2 },
      { id: 51, name: 'Pão com Ovo', price: 2.20, image: foodImages.paocomovo, rating: 4.1 },
      { id: 52, name: 'Ovos com Bacon', price: 4.00, image: foodImages.ovosebacon, rating: 4.7 }
    ],
    bebidas: [
      { id: 53, name: 'Caipirinha', description: 'Cachaça 51 ou Velho Barreiro, lima, açúcar e gelo', price: 6.00, image: foodImages.caipirinha, rating: 4.8 },
      { id: 54, name: 'Caipiblack', description: 'Cachaça preta, lima, açúcar e gelo', price: 6.00, image: foodImages.Caipiblack, rating: 4.9 },
      { id: 55, name: 'Whiskey Jamenson', price: 3.50, image: foodImages.vodka, rating: 4.7 },
      { id: 56, name: 'Whiskey J&B', price: 3.00, image: foodImages.vodka, rating: 4.5 },
      { id: 57, name: 'Whiskey Jack Daniels', price: 3.50, image: foodImages.vodka, rating: 4.8 },
      { id: 58, name: 'Whiskey Black Label', price: 4.00, image: foodImages.vodka, rating: 4.9 },
      { id: 59, name: 'Vodka', price: 4.00, image: foodImages.vodka, rating: 4.6 },
      { id: 60, name: 'Somersby', price: 2.50, image: foodImages.Somersby, rating: 4.4 },
      { id: 61, name: 'Imperial Heineken (0.20)', price: 1.50, image: foodImages.Imperial, rating: 4.5 },
      { id: 62, name: 'Caneca Heineken (0.50)', price: 3.00, image: foodImages.Imperial, rating: 4.7 },
      { id: 63, name: 'Cerveja Garrafa (0.33ml)', price: 1.40, image: foodImages.cerveja, rating: 4.3 },
      { id: 64, name: 'Cerveja Mini (0.20ml)', price: 1.10, image: foodImages.cerveja, rating: 4.2 },
        { id: 65, name: 'Superbock Preta', price: 1.40, image: foodImages.superbock, rating: 4.2 },
        { id: 66, name: 'Taça de Sangria', description: 'Sangria branca, rosé ou tinta', price: 6.00, image: foodImages.sangria, rating: 4.8 },
        { id: 67, name: 'Refrigerante Lata', price: 1.60, image: foodImages.refrigerantes, rating: 4.1 },
        { id: 68, name: 'Água 1.5L', price: 1.50, image: foodImages.agua, rating: 4.0 },
        { id: 69, name: 'Água 0.5L', price: 1.00, image: foodImages.agua, rating: 4.0 },
        { id: 70, name: 'Água 0.33L', price: 0.60, image: foodImages.agua, rating: 4.0 },
        { id: 71, name: 'Água Castelo', price: 1.40, image: foodImages.Castelo, rating: 4.2 },
        { id: 72, name: 'Água das Pedras', price: 1.50, image: foodImages.pedras, rating: 4.3 },
        { id: 73, name: 'Água das Pedras C/ Sabor', price: 1.80, image: foodImages.pedrassabor, rating: 4.3 },
        { id: 74, name: 'Balde de Heineken', price: 10.00, image: foodImages.baldedecerveja, rating: 4.9 }

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
      { id: 75, name: 'Pão de Queijo', price: 1.60, image: foodImages.paodequeijo, rating: 4.5 },
      { id: 76, name: 'Pastel de Nata', price: 1.30, image: foodImages.pasteldenata, rating: 4.7 },
      { id: 77, name: 'Empada de Frango', price: 2.00, image: foodImages.empadafrango, rating: 4.4 },
      { id: 78, name: 'Kibe', price: 2.20, image: foodImages.kibe, rating: 4.3 },
      { id: 79, name: 'Enroladinho de Salsicha e Queijo', price: 2.20, image: foodImages.fiambre, rating: 4.2 },
      { id: 80, name: 'Fiambre e Queijo', price: 2.20, image: foodImages.fiambreequeijo, rating: 4.2 },
      { id: 81, name: 'Bauru', price: 2.20, image: foodImages.bauru, rating: 4.1 },
      { id: 82, name: 'Bola de Queijo', price: 2.20, image: foodImages.bolaqueijo, rating: 4.3 },
      { id: 83, name: 'Coxinha de Frango', price: 2.20, image: foodImages.Coxinha, rating: 4.6 },
      { id: 84, name: 'Coxinha com Catupiry', price: 3.00, image: foodImages.Coxinha, rating: 4.8 },
      { id: 85, name: 'Hamburgão', price: 3.50, image: foodImages.hamburgao, rating: 4.7 }
    ],
    sobremesas: [
      { id: 86, name: 'Bolo no Pote - Prestígio', description: 'Chocolate com coco', price: 4.00, image: foodImages.Prestígio, rating: 4.8 },
      { id: 87, name: 'Bolo no Pote - Chocolate', description: 'Massa de chocolate com recheio de chocolate', price: 4.00, image: foodImages.doces, rating: 4.9 },
      { id: 88, name: 'Bolo no Pote - Ananás', description: 'Creme de ninho com pedaços de ananás', price: 4.00, image: foodImages.bolopoteananas, rating: 4.7 },
      { id: 89, name: 'Bolo no Pote - Choco Misto', description: 'Chocolate preto com ninho', price: 4.00, image: foodImages.doces, rating: 4.8 },
      { id: 90, name: 'Cheesecake - Goiabada', price: 3.50, image: foodImages.Cheesecake, rating: 4.7 },
      { id: 91, name: 'Cheesecake - Frutos Vermelhos', price: 3.50, image: foodImages.frutosvermelhos, rating: 4.8 },
      { id: 92, name: 'Brigadeiro Tradicional', price: 1.50, image: foodImages.doces, rating: 4.6 },
      { id: 93, name: 'Brigadeiro Beijinho', price: 1.50, image: foodImages.doces, rating: 4.5 },
      { id: 94, name: 'Brigadeiro Ninho', price: 2.00, image: foodImages.doces, rating: 4.8 },
      { id: 95, name: 'Brigadeiro Paçoca', price: 2.00, image: foodImages.doces, rating: 4.7 },
      { id: 96, name: 'Brigadeiro Morango', price: 2.00, image: foodImages.doces, rating: 4.8 },
      { id: 97, name: 'Brigadeiro Churros', price: 2.00, image: foodImages.doces, rating: 4.9 },
      { id: 98, name: 'Tarte de Toblerone', price: 2.20, image: foodImages.toblerone, rating: 4.7 },
      { id: 99, name: 'Bolo de Brigadeiro (fatia)', price: 2.20, image: foodImages.doces, rating: 4.8 }
    ]
  };

  // Efeito para verificar autenticação
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setIsAuthenticated(true);
        handleReconnectPrinter();
      } else {
        setIsAuthenticated(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // Efeito para carregar mesas e pedidos
  useEffect(() => {
    if (!isAuthenticated) return;

    setTables(initialTables());
    
    const tablesRef = ref(database, 'tables');
    const unsubscribe = onValue(tablesRef, (snapshot) => {
      const data = snapshot.val() || {};
      
      const tablesData = initialTables().map(table => {
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
                notes: item.notes || ''
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

      setTables(tablesData);
      setLastUpdate(new Date());
    });

    return () => unsubscribe();
  }, [isAuthenticated, initialTables]);

  // Efeito para carregar pedido selecionado
  useEffect(() => {
    if (!isAuthenticated || !selectedTable) {
      setSelectedOrder(null);
      return;
    }

    const orderRef = ref(database, `tables/${selectedTable}/currentOrder`);

    const unsubscribe = onValue(orderRef, (snapshot) => {
      const orderData = snapshot.val();
      
      if (orderData) {
        const orders = Object.entries(orderData);
        if (orders.length > 0) {
          const [orderId, order] = orders[0];
          const loadedOrder = { 
            id: orderId, 
            ...order,
            items: order.items?.map(item => ({
              ...item,
              notes: item.notes || ''
            })) || []
          };
          
          const newPrintedItems = {...printedItems};
          let hasPrintedItems = false;
          
          loadedOrder.items?.forEach(item => {
            const itemKey = `${selectedTable}-${item.id}-${item.addedAt || ''}`;
            if (item.printed && !printedItems[itemKey]) {
              newPrintedItems[itemKey] = true;
              hasPrintedItems = true;
            }
          });
          
          if (hasPrintedItems) {
            setPrintedItems(newPrintedItems);
          }
          
          setSelectedOrder(loadedOrder);
          setDeliveryAddress(loadedOrder.deliveryAddress || '');

          // Fechar automaticamente se não houver itens
          if (loadedOrder.items?.length === 0) {
            closeOrderAutomatically(loadedOrder);
          }
        } else {
          setSelectedOrder(null);
        }
      } else {
        setSelectedOrder(null);
      }
    });

    return () => unsubscribe();
  }, [isAuthenticated, selectedTable, printedItems]);

  // Efeito para monitorar pedidos via QR Code
  useEffect(() => {
    if (!isAuthenticated) return;

    const qrOrdersRef = ref(database, 'qrCodeOrders');
    const unsubscribe = onValue(qrOrdersRef, (snapshot) => {
      const data = snapshot.val() || {};
      const qrOrders = Object.entries(data).map(([id, order]) => ({
        id,
        ...order,
        createdAt: order.createdAt || Date.now()
      }));

      setQrCodeOrders(qrOrders);

      // Verificar se há novos pedidos
      if (qrOrders.length > 0) {
        const latestOrder = qrOrders[qrOrders.length - 1];
        
        // Verificar se é um pedido novo (últimos 5 segundos)
        if (Date.now() - latestOrder.createdAt < 5000) {
          handleNewQrOrder(latestOrder);
        }
      }
    });

    return () => unsubscribe();
  }, [isAuthenticated]);

  // Efeito para limpar notificação após 10 segundos
  useEffect(() => {
    if (showQrNotification) {
      if (notificationTimeoutRef.current) {
        clearTimeout(notificationTimeoutRef.current);
      }
      
      notificationTimeoutRef.current = setTimeout(() => {
        setShowQrNotification(false);
        setCurrentQrOrder(null);
      }, 10000);
    }

    return () => {
      if (notificationTimeoutRef.current) {
        clearTimeout(notificationTimeoutRef.current);
      }
    };
  }, [showQrNotification]);

  // Função para lidar com novo pedido via QR Code
const handleNewQrOrder = useCallback((order) => {
  // Tentar tocar o som de notificação
  const playSound = async () => {
    try {
      if (audioRef.current) {
        audioRef.current.currentTime = 0; // Reinicia o áudio se já estiver tocando
        await audioRef.current.play();
      }
    } catch (err) {
      console.error("Erro ao tocar som de notificação:", err);
    }
  };
  
  playSound();
  
  // Mostrar notificação
  setCurrentQrOrder(order);
  setShowQrNotification(true);
  
  // Atualizar a mesa correspondente
  setTables(prevTables => prevTables.map(table => {
    if (table.id === order.tableId) {
      return {
        ...table,
        currentOrder: {
          id: order.id,
          items: order.items,
          status: 'open',
          createdAt: order.createdAt,
          updatedAt: order.createdAt,
          tableId: order.tableId,
          deliveryAddress: order.deliveryAddress || ''
        },
        status: 'occupied'
      };
    }
    return table;
  }));
}, []);

  // Função para fechar pedido automaticamente quando não há itens
  const closeOrderAutomatically = useCallback(async (order) => {
    if (!selectedTable || !order?.id) return;
    
    try {
      const table = tables.find(t => t.id === selectedTable);
      
      const orderToClose = {
        ...order,
        total: 0,
        deliveryFee: 0,
        paymentMethod: 'dinheiro',
        closedAt: Date.now(),
        closedBy: getAuth().currentUser?.email || 'admin',
        autoClosed: true
      };

      // Adicionar ao histórico
      const historyRef = ref(database, `tables/${selectedTable}/ordersHistory`);
      await push(historyRef, orderToClose);
      
      // Remover pedido atual
      const orderRef = ref(database, `tables/${selectedTable}/currentOrder/${order.id}`);
      await remove(orderRef);
      
      // Atualizar status da mesa/comanda
      const tableRef = ref(database, `tables/${selectedTable}`);
      await update(tableRef, {
        status: 'available'
      });
      
      // Atualizar estado local
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
    } catch (error) {
      console.error("Erro ao fechar comanda automaticamente:", error);
    }
  }, [selectedTable, tables]);

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

  // Funções de persistência da impressora
  const savePrinterState = useCallback((device, characteristic) => {
    try {
      const printerState = {
        deviceId: device.id,
        deviceName: device.name,
        connected: device.gatt.connected,
        lastConnected: Date.now()
      };
      localStorage.setItem('bluetoothPrinter', JSON.stringify(printerState));
    } catch (err) {
      console.error('Erro ao salvar estado da impressora:', err);
    }
  }, []);

  const clearPrinterState = useCallback(() => {
    localStorage.removeItem('bluetoothPrinter');
    setPrinterConnected(false);
  }, []);

  const handleDisconnection = useCallback(() => {
    console.log('Impressora desconectada');
    clearPrinterState();
    printerDeviceRef.current = null;
    printerCharacteristicRef.current = null;
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
  
      setLoading(true);
      setError(null);
  
      if (printerDeviceRef.current?.gatt?.connected) {
        return true;
      }
  
      console.log('Procurando dispositivo Bluetooth...');
      const device = await navigator.bluetooth.requestDevice({
        filters: [{ name: PRINTER_CONFIG.deviceName }],
        optionalServices: [PRINTER_CONFIG.serviceUUID]
      });
  
      if (!device) {
        throw new Error('Nenhum dispositivo selecionado');
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
  
      console.log('Conectado com sucesso à impressora');
      return true;
    } catch (err) {
      console.error('Erro na conexão Bluetooth:', err);
      printerDeviceRef.current = null;
      printerCharacteristicRef.current = null;
      setPrinterConnected(false);
      setError(`Falha na conexão: ${err.message}`);
      return false;
    } finally {
      setLoading(false);
    }
  }, [PRINTER_CONFIG, handleDisconnection, savePrinterState]);

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

  // Função para marcar itens como impressos
  const markItemsAsPrinted = useCallback(async (tableId, orderId, items) => {
    try {
      const orderRef = ref(database, `tables/${tableId}/currentOrder/${orderId}`);
      
      const newPrintedItems = {...printedItems};
      const newSentItems = {...sentItems};
      
      items.forEach(item => {
        const itemKey = `${tableId}-${item.id}-${item.addedAt}`;
        newPrintedItems[itemKey] = true;
        newSentItems[itemKey] = true;
      });
      
      setPrintedItems(newPrintedItems);
      setSentItems(newSentItems);

      const currentOrderSnapshot = await get(orderRef);
      const currentOrder = currentOrderSnapshot.val();
      
      const updatedItems = currentOrder.items.map(orderItem => {
        const wasPrinted = items.some(
          printedItem => printedItem.id === orderItem.id && printedItem.addedAt === orderItem.addedAt
        );
        return wasPrinted ? { ...orderItem, printed: true } : orderItem;
      });

      await update(orderRef, {
        items: updatedItems,
        updatedAt: Date.now()
      });

    } catch (err) {
      console.error("Erro ao marcar itens como impressos:", err);
      const revertedPrintedItems = {...printedItems};
      items.forEach(item => {
        delete revertedPrintedItems[`${tableId}-${item.id}-${item.addedAt}`];
      });
      setPrintedItems(revertedPrintedItems);
      throw err;
    }
  }, [printedItems, sentItems]);

  // Função para imprimir pedido
  const printOrder = useCallback(async () => {
    if (!selectedTable || !selectedOrder?.id || !selectedOrder.items?.length) {
      setError('Nenhum pedido válido para imprimir');
      return;
    }
  
    try {
      setIsPrinting(true);
      setError(null);
      
      const itemsToPrint = selectedOrder.items.filter(item => {
        const itemKey = `${selectedTable}-${item.id}-${item.addedAt || ''}`;
        return !printedItems[itemKey] && !item.printed;
      });
  
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
        await markItemsAsPrinted(selectedTable, selectedOrder.id, itemsToPrint);
        
        setSelectedOrder(prev => ({
          ...prev,
          items: prev.items.map(item => {
            const wasPrinted = itemsToPrint.some(
              printedItem => printedItem.id === item.id && printedItem.addedAt === item.addedAt
            );
            return wasPrinted ? { ...item, printed: true } : item;
          })
        }));
      }
    } catch (err) {
      console.error('Erro ao imprimir:', err);
      setError(`Falha na impressão: ${err.message}`);
    } finally {
      setIsPrinting(false);
    }
  }, [selectedTable, selectedOrder, printedItems, formatReceipt, sendToPrinter, markItemsAsPrinted]);

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

  // Função para adicionar item ao pedido
  const addItemToOrder = useCallback(async () => {
    if (!selectedTable || !selectedMenuItem) return;

    setLoading(true);
    try {
      let orderRef;
      let orderData;
      
      if (selectedOrder?.id) {
        // Limpa os itens enviados quando um novo item é adicionado
        setSentItems({});
        
        orderRef = ref(database, `tables/${selectedTable}/currentOrder/${selectedOrder.id}`);
        const currentItems = selectedOrder.items || [];
        
        orderData = {
          items: [...currentItems, {
            ...selectedMenuItem,
            quantity: newItemQuantity,
            addedAt: Date.now(),
            printed: false,
            notes: itemNotes[selectedMenuItem.id] || ''
          }],
          updatedAt: Date.now(),
          deliveryAddress: deliveryAddress
        };
      } else {
        orderRef = ref(database, `tables/${selectedTable}/currentOrder`);
        orderData = {
          items: [{
            ...selectedMenuItem,
            quantity: newItemQuantity,
            addedAt: Date.now(),
            printed: false,
            notes: itemNotes[selectedMenuItem.id] || ''
          }],
          status: 'open',
          createdAt: Date.now(),
          updatedAt: Date.now(),
          tableId: selectedTable,
          deliveryAddress: deliveryAddress
          };
        }

        if (selectedOrder?.id) {
          await update(orderRef, orderData);
        } else {
          const newOrderRef = await push(orderRef, orderData);
          setSelectedOrder({ id: newOrderRef.key, ...orderData });
          
          // Atualizar status da mesa/comanda
          const tableRef = ref(database, `tables/${selectedTable}`);
          await update(tableRef, {
            status: 'occupied'
          });
        }

        // Resetar estado sem fechar o modal
        setSelectedMenuItem(null);
        setNewItemQuantity(1);
        setItemNotes(prev => ({
          ...prev,
          [selectedMenuItem.id]: ''
        }));
        
        // Scroll para o topo do menu de categorias
        if (menuCategoriesRef.current) {
          menuCategoriesRef.current.scrollTo({ top: 0, behavior: 'smooth' });
        }
        if (menuItemsRef.current) {
          menuItemsRef.current.scrollTo({ top: 0, behavior: 'smooth' });
        }
        
      } catch (err) {
        setError('Erro ao adicionar item');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }, [selectedTable, selectedMenuItem, selectedOrder, newItemQuantity, itemNotes, deliveryAddress]);

  // Função para remover item do pedido
  const removeItemFromOrder = useCallback(async (itemId) => {
    if (!selectedTable || !selectedOrder?.items) return;
    
    setLoading(true);
    try {
      const orderRef = ref(database, `tables/${selectedTable}/currentOrder/${selectedOrder.id}`);
      const updatedItems = selectedOrder.items.filter(item => item.id !== itemId);
      
      await update(orderRef, {
        items: updatedItems,
        updatedAt: Date.now()
      });

      // Se não houver mais itens, fechar automaticamente
      if (updatedItems.length === 0) {
        await closeOrderAutomatically({
          ...selectedOrder,
          items: updatedItems
        });
      }
    } catch (err) {
      setError(`Falha ao remover item: ${err.message}`);
      console.error("Erro detalhado:", err);
    } finally {
      setLoading(false);
    }
  }, [selectedTable, selectedOrder, closeOrderAutomatically]);

  // Função para atualizar quantidade do item
  const updateItemQuantity = useCallback(async (itemId, newQuantity) => {
    if (!selectedTable || !selectedOrder?.items || newQuantity < 1) return;
    
    setLoading(true);
    try {
      const orderRef = ref(database, `tables/${selectedTable}/currentOrder/${selectedOrder.id}`);
      const updatedItems = selectedOrder.items.map(item => 
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      );
      
      await update(orderRef, {
        items: updatedItems,
        updatedAt: Date.now()
      });
    } catch (err) {
      setError(`Falha ao atualizar quantidade: ${err.message}`);
      console.error("Erro detalhado:", err);
    } finally {
      setLoading(false);
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

    // Filtro por termo de busca
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
  const handleTableSelect = useCallback((tableNumber) => {
    const tableStr = tableNumber.toString();
    setSelectedTable(tableStr);
    setShowTableDetailsModal(true);
  }, []);

  // Função para verificar itens não impressos
  const hasUnprintedItems = useCallback((order) => {
    if (!order?.items) return false;
    return order.items.some(item => {
      const itemKey = `${selectedTable}-${item.id}-${item.addedAt || ''}`;
      return !printedItems[itemKey] && !item.printed && !sentItems[itemKey];
    });
  }, [selectedTable, printedItems, sentItems]);

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

  // Função para fechar notificação de QR Code
const closeQrNotification = useCallback((viewDetails = false) => {
  if (viewDetails && currentQrOrder) {
    // Se o usuário clicou em "Ver Detalhes", seleciona a mesa e abre o modal
    setSelectedTable(currentQrOrder.tableId);
    setShowTableDetailsModal(true);
  }
  
  // Fecha a notificação e limpa o estado
  setShowQrNotification(false);
  setCurrentQrOrder(null);
  
  // Limpa o timeout se existir
  if (notificationTimeoutRef.current) {
    clearTimeout(notificationTimeoutRef.current);
    notificationTimeoutRef.current = null;
  }
}, [currentQrOrder]);

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
            
            <div className="flex items-center gap-2">
              <button 
                onClick={connectToPrinter}
                className={`px-3 py-1.5 rounded-lg flex items-center gap-2 text-sm font-medium ${
                  printerConnected 
                    ? 'bg-green-100 text-green-800 border border-green-200' 
                    : 'bg-red-100 text-red-800 border border-red-200 hover:bg-red-50'
                } transition-colors`}
              >
                <div className={`w-2 h-2 rounded-full ${printerConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
                {printerConnected ? 'Impressora Conectada' : 'Conectar Impressora'}
              </button>
              
              <button
                onClick={loadOrderHistory}
                className="px-3 py-1.5 rounded-lg flex items-center gap-2 text-sm font-medium bg-purple-100 text-purple-800 border border-purple-200 hover:bg-purple-50 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Histórico
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
                const badgeColor = getTableBadgeColor(table);
                const tableIcon = getTableIcon(table);
                
                return (
                  <button
                    key={table.id}
                    onClick={() => handleTableSelect(table.id)}
                    className={`relative p-3 rounded-xl transition-all duration-200 ${
                      selectedTable === table.id 
                        ? 'bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 shadow-inner' 
                        : 'bg-white border border-gray-200 hover:border-blue-100 hover:shadow-sm'
                    } flex flex-col items-center justify-center h-full min-h-[100px]`}
                  >
                    <div className={`absolute top-1 right-1 ${badgeColor} text-xs px-2 py-0.5 rounded-full flex items-center`}>
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

  // Renderização do modal de histórico
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
                                {new Date(order.closedAt).toLocaleString('pt-PT', {
                                  day: '2-digit',
                                  month: '2-digit',
                                  year: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
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

  // Renderização do modal para adicionar itens
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
                    € {(selectedMenuItem.price * newItemQuantity).toFixed(2)}
                  </span>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    onClick={() => {
                      setSelectedMenuItem(null);
                      setSearchTerm('');
                      setShowSearchResults(false);
                    }}
                    className="px-4 py-3 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-colors border border-gray-300 font-medium"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={addItemToOrder}
                    className="px-4 py-3 bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-colors font-medium flex items-center justify-center gap-2"
                    disabled={loading}
                  >
                    {loading && (
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    )}
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
                      const isPrinted = printedItems[`${selectedTable}-${item.id}-${item.addedAt || ''}`] || item.printed;

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
                              onClick={() => removeItemFromOrder(item.id)}
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
                        disabled={isPrinting || !hasUnprintedItems(selectedOrder)}
                        className={`px-4 py-3 rounded-lg transition-all hover:shadow-md flex items-center justify-center gap-2 font-medium ${
                          isPrinting || !hasUnprintedItems(selectedOrder)
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
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 012 2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                            </svg>
                            {hasUnprintedItems(selectedOrder) ? 'Enviar para Cozinha' : 'Enviado'}
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

  // Renderização da notificação de pedido via QR Code
  const renderQrNotification = () => {
    if (!showQrNotification || !currentQrOrder) return null;

    const table = tables.find(t => t.id === currentQrOrder.tableId);
    const tableType = table?.type === 'comanda' ? 'Comanda' : 'Mesa';
    const tableName = `${tableType} ${currentQrOrder.tableId}`;
    const orderTotal = calculateOrderTotal(currentQrOrder);

    return (
      <div className="fixed bottom-4 right-4 z-50 animate-bounce">
        <div className="bg-white rounded-xl shadow-xl border-2 border-blue-500 w-full max-w-md overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-3 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
              </svg>
              <h3 className="text-lg font-bold text-white">Novo Pedido via QR Code</h3>
            </div>
            <button 
              onClick={closeQrNotification}
              className="text-white hover:text-blue-200 p-1 rounded-full"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="p-4">
            <div className="flex justify-between items-center mb-3">
              <div className="font-medium text-gray-700">{tableName}</div>
              <div className="text-sm text-gray-500">
                {new Date(currentQrOrder.createdAt).toLocaleTimeString()}
              </div>
            </div>
            
            <div className="space-y-2 mb-4">
              {currentQrOrder.items?.slice(0, 3).map((item, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500">{item.quantity}x</span>
                    <span>{item.name}</span>
                  </div>
                  <div className="text-gray-700 font-medium">
                    € {(item.price * (item.quantity || 1)).toFixed(2)}
                  </div>
                </div>
              ))}
              
              {currentQrOrder.items?.length > 3 && (
                <div className="text-sm text-gray-500">
                  + {currentQrOrder.items.length - 3} itens
                </div>
              )}
            </div>
            
            <div className="flex justify-between items-center border-t border-gray-200 pt-3">
              <span className="font-bold text-gray-800">Total:</span>
              <span className="text-lg font-bold text-blue-600">
                € {orderTotal.toFixed(2)}
              </span>
            </div>
            
            <div className="mt-4 grid grid-cols-2 gap-2">
              <button
                onClick={() => closeQrNotification(true)} // Passa true para viewDetails
                className="px-3 py-2 bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-colors font-medium flex items-center justify-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Ver Detalhes
              </button>
            <button
              onClick={() => closeQrNotification()} // Não passa parâmetro (viewDetails = false)
              className="px-3 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-colors border border-gray-300 font-medium"
            >
              Fechar
            </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Renderização do conteúdo principal
  const renderMainContent = () => (
    <div className="min-h-screen bg-gray-50">
      {/* Elemento de áudio para notificação */}
      <audio 
        ref={audioRef} 
        src={notificationSound} 
        preload="auto"
        // Adicione isso para contornar políticas de autoplay
        muted={false}
        loop={false}
      />
      {/* Notificações */}
      {error && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-6 py-3 rounded-lg shadow-xl z-50 flex items-center animate-fade-in">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 0v6m0-6h.01M12 9h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
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
      {renderQrNotification()}
    </div>
  );

  // Renderização condicional
  return !isAuthenticated ? renderLogin() : renderMainContent();
};

export default AdminPanel;