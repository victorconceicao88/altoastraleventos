import { useState, useEffect, useRef } from 'react';
import { ref, onValue, update, push, remove, set, get } from 'firebase/database';
import { database } from '../firebase';
import { signInWithEmailAndPassword, getAuth } from 'firebase/auth';
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
  const [selectedOrder, setSelectedOrder] = useState({ items: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [newItemQuantity, setNewItemQuantity] = useState(1);
  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const [selectedMenuItem, setSelectedMenuItem] = useState(null);
  const [newOrders, setNewOrders] = useState([]);
  const [showNewOrdersModal, setShowNewOrdersModal] = useState(false);
  const [isClosingOrder, setIsClosingOrder] = useState(false);
  const [showSuccessNotification, setShowSuccessNotification] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [billRequests, setBillRequests] = useState([]);
  const billRequestsRef = useRef(new Set());
  const [initialLoad, setInitialLoad] = useState(true);
  const [consumptionItems, setConsumptionItems] = useState([]);
  const [showCloseConfirmation, setShowCloseConfirmation] = useState(false);
  const [showConsumptionModal, setShowConsumptionModal] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);
  const [printerConnected, setPrinterConnected] = useState(false);
  const printerDeviceRef = useRef(null);
  const printerCharacteristicRef = useRef(null);
  const [printedItems, setPrintedItems] = useState({});
  const [printerReconnectAttempted, setPrinterReconnectAttempted] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [currentPage, setCurrentPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);

  // Configuração inicial das mesas e comandas
  const initialTables = () => {
    const tables = [];
    
    // Mesas internas (1-8)
    for (let i = 1; i <= 8; i++) {
      tables.push({
        id: i.toString(),
        type: 'interna',
        capacity: i <= 4 ? 4 : 6, // Mesas 1-4: 4 lugares, 5-8: 6 lugares
        location: 'Área interna'
      });
    }
    
    // Mesas externas (9-16)
    for (let i = 9; i <= 16; i++) {
      tables.push({
        id: i.toString(),
        type: 'externa',
        capacity: i <= 12 ? 4 : 6, // Mesas 9-12: 4 lugares, 13-16: 6 lugares
        location: 'Terraço'
      });
    }
    
    // Comandas adicionais (17-50) - para delivery/balcão
    for (let i = 17; i <= 50; i++) {
      tables.push({
        id: i.toString(),
        type: 'comanda',
        capacity: 0,
        location: i <= 30 ? 'Balcão' : 'Delivery'
      });
    }
    
    return tables;
  };

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

  // Search functionality
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
  }, [searchTerm]);

  // Configurações da impressora Bluetooth
  const PRINTER_CONFIG = {
    deviceName: "BlueTooth Printer",
    serviceUUID: "0000ff00-0000-1000-8000-00805f9b34fb",
    characteristicUUID: "0000ff02-0000-1000-8000-00805f9b34fb",
    maxRetries: 3,
    chunkSize: 100,
    delayBetweenChunks: 100
  };

  const savePrinterState = (device, characteristic) => {
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
  };

  const clearPrinterState = () => {
    localStorage.removeItem('bluetoothPrinter');
    setPrinterConnected(false);
  };

  const tryReconnectPrinter = async () => {
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

      setIsPrinting(true);
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
    } finally {
      setIsPrinting(false);
    }
  };

  const connectToPrinter = async () => {
    try {
      if (!navigator.bluetooth) {
        throw new Error('Bluetooth não suportado neste navegador');
      }
  
      setIsPrinting(true);
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
      setIsPrinting(false);
    }
  };
  
  const handleDisconnection = () => {
    console.log('Impressora desconectada');
    clearPrinterState();
    printerDeviceRef.current = null;
    printerCharacteristicRef.current = null;
  };

  const handleReconnectPrinter = async () => {
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
  
      setIsPrinting(true);
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
  
      const server = await device.gatt.connect();
      const service = await server.getPrimaryService(PRINTER_CONFIG.serviceUUID);
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
    } finally {
      setIsPrinting(false);
      setPrinterReconnectAttempted(true);
    }
  };

  const sendToPrinter = async (data) => {
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
  };

  const formatReceipt = (order) => {
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
  
    let receipt = INIT;
    receipt += `${CENTER}${BOLD_ON}ALTO ASTRAL${BOLD_OFF}${LF}`;
    receipt += `MESA: ${selectedTable}${LF}`;
    receipt += `${new Date().toLocaleString()}${LF}${LF}`;
    receipt += '--------------------------------' + LF;
    
    receipt += LEFT;
    order.items.forEach(item => {
      receipt += `${BOLD_ON}${item.quantity}x ${item.name}${BOLD_OFF}${LF}`;
      if (item.description) {
        receipt += `${item.description}${LF}`;
      }
      receipt += `€ ${(item.price * item.quantity).toFixed(2)}${LF}${LF}`;
    });
  
    receipt += '--------------------------------' + LF;
    receipt += `${BOLD_ON}TOTAL: € ${calculateOrderTotal(order).toFixed(2)}${BOLD_OFF}${LF}${LF}`;
    receipt += `${CENTER}Obrigado pela sua preferência!${LF}${LF}`;
    receipt += `${CENTER}Volte sempre${LF}${LF}`;
    receipt += `${FEED}${FEED}${CUT}`;
  
    return receipt;
  };

  const markItemsAsPrinted = async (tableId, orderId, items) => {
    try {
      const orderRef = ref(database, `tables/${tableId}/currentOrder/${orderId}`);
      
      const newPrintedItems = {...printedItems};
      items.forEach(item => {
        newPrintedItems[`${tableId}-${item.id}-${item.addedAt}`] = true;
      });
      setPrintedItems(newPrintedItems);
  
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
  };
  
  const printOrder = async () => {
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
        
        setShowSuccessNotification(true);
        setTimeout(() => setShowSuccessNotification(false), 3000);
        
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
  };

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
              ...orders[0][1]
            };
          }
        }

        return { 
          ...table,
          currentOrder,
          ordersHistory: tableData.ordersHistory || {}
        };
      });

      setTables(tablesData);
      setLastUpdate(new Date());
    });

    return () => unsubscribe();
  }, [isAuthenticated]);

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
          const loadedOrder = { id: orderId, ...order };
          
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
        } else {
          setSelectedOrder(null);
        }
      } else {
        setSelectedOrder(null);
      }
    });
  
    return () => unsubscribe();
  }, [isAuthenticated, selectedTable]);

  const createNewOrder = async () => {
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
        tableId: selectedTable
      };

      await set(newOrderRef, newOrder);
      setSelectedOrder(newOrder);
    } catch (err) {
      setError('Erro ao criar novo pedido');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const closeOrder = async () => {
    if (!selectedTable || !selectedOrder?.id) return;
    
    setIsClosingOrder(true);
    try {
      // Calculate delivery fee if applicable
      const table = tables.find(t => t.id === selectedTable);
      let total = calculateOrderTotal(selectedOrder);
      
      if (table?.type === 'comanda' && table?.location === 'Delivery') {
        // Count delivery items
        const deliveryCount = selectedOrder.items.filter(item => 
          item.category === 'delivery'
        ).length;
        
        // Add R$2.50 fee if there are 2 or more delivery items
        if (deliveryCount >= 2) {
          total += 2.50;
        }
      }

      const orderToClose = {
        ...selectedOrder,
        total: total,
        closedAt: Date.now()
      };

      const historyRef = ref(database, `tables/${selectedTable}/ordersHistory`);
      await push(historyRef, orderToClose);
      
      const orderRef = ref(database, `tables/${selectedTable}/currentOrder/${selectedOrder.id}`);
      await remove(orderRef);
      
      setSelectedOrder(null);
      setShowSuccessNotification(true);
      setTimeout(() => setShowSuccessNotification(false), 3000);
    } catch (error) {
      console.error("Erro ao fechar comanda:", error);
      setError('Erro ao fechar comanda');
    } finally {
      setIsClosingOrder(false);
      setShowCloseConfirmation(false);
    }
  };

  const addItemToOrder = async () => {
    if (!selectedTable || !selectedMenuItem) return;
  
    setLoading(true);
    try {
      let orderRef;
      let orderData;
      
      if (selectedOrder?.id) {
        orderRef = ref(database, `tables/${selectedTable}/currentOrder/${selectedOrder.id}`);
        const currentItems = selectedOrder.items || [];
        
        orderData = {
          items: [...currentItems, {
            ...selectedMenuItem,
            quantity: newItemQuantity,
            addedAt: Date.now(),
            printed: false
          }],
          updatedAt: Date.now()
        };
      } else {
        orderRef = ref(database, `tables/${selectedTable}/currentOrder`);
        orderData = {
          items: [{
            ...selectedMenuItem,
            quantity: newItemQuantity,
            addedAt: Date.now(),
            printed: false
          }],
          status: 'open',
          createdAt: Date.now(),
          updatedAt: Date.now(),
          tableId: selectedTable
        };
      }
  
      if (selectedOrder?.id) {
        await update(orderRef, orderData);
      } else {
        const newOrderRef = await push(orderRef, orderData);
        setSelectedOrder({ id: newOrderRef.key, ...orderData });
      }
  
      setShowAddItemModal(false);
      setSelectedMenuItem(null);
      setNewItemQuantity(1);
    } catch (err) {
      setError('Erro ao adicionar item');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const removeItemFromOrder = async (itemId) => {
    if (!selectedTable || !selectedOrder?.items) return;
    
    setLoading(true);
    try {
      const orderRef = ref(database, `tables/${selectedTable}/currentOrder/${selectedOrder.id}`);
      const updatedItems = selectedOrder.items.filter(item => item.id !== itemId);
      
      await update(orderRef, {
        items: updatedItems,
        updatedAt: Date.now()
      });
    } catch (err) {
      setError(`Falha ao remover item: ${err.message}`);
      console.error("Erro detalhado:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateItemQuantity = async (itemId, newQuantity) => {
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
      
      setEditingItem(null);
    } catch (err) {
      setError(`Falha ao atualizar quantidade: ${err.message}`);
      console.error("Erro detalhado:", err);
    } finally {
      setLoading(false);
    }
  };

  const calculateOrderTotal = (order) => {
    if (!order?.items) return 0;
    return order.items.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
  };

  const handleTableSelect = (tableNumber) => {
    const tableStr = tableNumber.toString();
    setSelectedTable(tableStr);
  };

  const hasUnprintedItems = (order) => {
    if (!order?.items) return false;
    return order.items.some(item => {
      const itemKey = `${selectedTable}-${item.id}-${item.addedAt || ''}`;
      return !printedItems[itemKey] && !item.printed;
    });
  };

  const filteredTables = () => {
    if (activeTab === 'active') {
      return tables.filter(t => t.currentOrder);
    } else if (activeTab === 'vip') {
      return tables.filter(t => {
        const total = t.currentOrder ? calculateOrderTotal(t.currentOrder) : 0;
        return total > 100;
      });
    } else if (activeTab === 'internas') {
      return tables.filter(t => t.type === 'interna');
    } else if (activeTab === 'externas') {
      return tables.filter(t => t.type === 'externa');
    } else if (activeTab === 'comandas') {
      return tables.filter(t => t.type === 'comanda');
    }
    return tables;
  };

  const tablesPerPage = 12;
  const paginatedTables = () => {
    const start = currentPage * tablesPerPage;
    return filteredTables().slice(start, start + tablesPerPage);
  };

  const totalPages = Math.ceil(filteredTables().length / tablesPerPage);

  const getTableBadgeColor = (table) => {
    if (table.type === 'interna') return 'bg-blue-100 text-blue-800';
    if (table.type === 'externa') return 'bg-green-100 text-green-800';
    if (table.type === 'comanda') {
      return table.location === 'Balcão' 
        ? 'bg-purple-100 text-purple-800' 
        : 'bg-orange-100 text-orange-800';
    }
    return 'bg-gray-100 text-gray-800';
  };

  const getTableIcon = (table) => {
    if (table.type === 'interna') return '🏠';
    if (table.type === 'externa') return '🌿';
    if (table.type === 'comanda') return table.location === 'Balcão' ? '🍽️' : '🚴';
    return '🪑';
  };

  const PremiumHeader = () => (
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
            </div>
          </div>
        </div>
      </div>
    </header>
  );

  const TableTabsView = () => (
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
          <button
            onClick={() => { setActiveTab('all'); setCurrentPage(0); }}
            className={`px-3 py-1 text-sm rounded-full whitespace-nowrap ${
              activeTab === 'all' 
                ? 'bg-blue-100 text-blue-800 font-medium' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Todas
          </button>
          <button
            onClick={() => { setActiveTab('active'); setCurrentPage(0); }}
            className={`px-3 py-1 text-sm rounded-full whitespace-nowrap ${
              activeTab === 'active' 
                ? 'bg-green-100 text-green-800 font-medium' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Ativas
          </button>
          <button
            onClick={() => { setActiveTab('vip'); setCurrentPage(0); }}
            className={`px-3 py-1 text-sm rounded-full whitespace-nowrap ${
              activeTab === 'vip' 
                ? 'bg-amber-100 text-amber-800 font-medium' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            VIP
          </button>
          <button
            onClick={() => { setActiveTab('internas'); setCurrentPage(0); }}
            className={`px-3 py-1 text-sm rounded-full whitespace-nowrap ${
              activeTab === 'internas' 
                ? 'bg-blue-100 text-blue-800 font-medium' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Internas
          </button>
          <button
            onClick={() => { setActiveTab('externas'); setCurrentPage(0); }}
            className={`px-3 py-1 text-sm rounded-full whitespace-nowrap ${
              activeTab === 'externas' 
                ? 'bg-green-100 text-green-800 font-medium' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Externas
          </button>
          <button
            onClick={() => { setActiveTab('comandas'); setCurrentPage(0); }}
            className={`px-3 py-1 text-sm rounded-full whitespace-nowrap ${
              activeTab === 'comandas' 
                ? 'bg-purple-100 text-purple-800 font-medium' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Comandas
          </button>
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
                      {tableIcon} {table.location}
                    </div>
                    
                    {isVIP && hasOrder && (
                      <div className="absolute top-1 left-1 bg-gradient-to-r from-amber-500 to-amber-600 text-white text-xs px-2 py-0.5 rounded-full flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
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
                      <span className="text-xs text-gray-400 px-3 py-1 rounded-full bg-gray-50">Disponível</span>
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

  // Login function
  const handleLogin = async (e) => {
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
  };

  // If not authenticated, show login form
  if (!isAuthenticated) {
    return (
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
            
            <div className="mt-4 text-center text-sm text-gray-500">
              <p>Usuário: admin</p>
              <p>Senha: Gerencia22</p>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {showSuccessNotification && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-emerald-500 text-white px-6 py-3 rounded-lg shadow-xl z-50 flex items-center animate-fade-in">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          {isPrinting ? 'Pedido enviado para impressora!' : 'Operação realizada com sucesso!'}
          <button 
            onClick={() => setShowSuccessNotification(false)} 
            className="ml-4 p-1 rounded-full hover:bg-emerald-600 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      {(loading || isPrinting) && (
        <div className="fixed inset-0 bg-black/20 z-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl shadow-xl flex items-center gap-3">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="font-medium text-gray-700">Processando...</span>
          </div>
        </div>
      )}

      <PremiumHeader />

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

      <div className="container mx-auto flex flex-col md:flex-row">
        <TableTabsView />
        
        <main className="flex-1 p-4 bg-gray-50 min-h-[calc(100vh-4rem)]">
          {selectedTable ? (
            <div className="space-y-4">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 md:p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="bg-white p-3 rounded-lg shadow-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                      </div>
                      <div>
                        <h2 className="text-xl md:text-2xl font-bold text-gray-800">
                          {selectedTable <= 16 ? `Mesa ${selectedTable}` : `Comanda ${selectedTable}`}
                        </h2>
                        <p className="text-sm text-gray-500">
                          {selectedOrder?.items?.length || 0} itens • € {selectedOrder ? calculateOrderTotal(selectedOrder).toFixed(2) : '0.00'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <button
                        onClick={() => setShowAddItemModal(true)}
                        className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white px-3 py-2 md:px-4 md:py-2 rounded-lg text-sm hover:from-blue-700 hover:to-indigo-700 transition-all hover:shadow-md flex items-center gap-2 whitespace-nowrap"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        Adicionar Item
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 md:p-6">
                  {selectedOrder ? (
                    <>
                      <div className="space-y-3 mb-6">
                        {selectedOrder.items?.length > 0 ? (
                          selectedOrder.items.map((item) => {
                            const isPrinted =
                              printedItems[
                                `${selectedTable}-${item.id}-${item.addedAt || ''}`
                              ] || item.printed;

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
                              onClick={() => setShowAddItemModal(true)}
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
                              € {calculateOrderTotal(selectedOrder).toFixed(2)}
                            </span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <button
                              onClick={() => setShowAddItemModal(true)}
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
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                                  </svg>
                                  Enviar para Cozinha
                                </>
                              )}
                            </button>

                            <button
                              onClick={() => setShowCloseConfirmation(true)}
                              className="bg-gradient-to-br from-red-500 to-pink-500 text-white px-4 py-3 rounded-lg hover:from-red-600 hover:to-pink-600 transition-all hover:shadow-md flex items-center justify-center gap-2 font-medium"
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
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
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
                        onClick={() => setShowAddItemModal(true)}
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
          ) : (
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
  
      {/* Modal de confirmação para fechar comanda */}
      {showCloseConfirmation && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-red-100 p-2 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-800">Fechar Comanda</h3>
              </div>
              <p className="text-gray-600 mb-6">Tem certeza que deseja fechar esta comanda? Esta ação não pode ser desfeita.</p>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => setShowCloseConfirmation(false)}
                  className="px-4 py-3 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-colors border border-gray-300 font-medium flex-1"
                >
                  Cancelar
                </button>
                <button
                  onClick={closeOrder}
                  disabled={isClosingOrder}
                  className="px-4 py-3 bg-gradient-to-br from-red-600 to-pink-600 text-white rounded-lg hover:from-red-700 hover:to-pink-700 transition-colors font-medium flex-1 flex items-center justify-center gap-2"
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
                  Confirmar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showAddItemModal && (
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
                
                {showSearchResults ? (
                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-700 mb-2">
                      Resultados para "{searchTerm}"
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                    {Object.entries(menu).map(([category, items]) => (
                      <div key={category}>
                        <h4 className="font-semibold text-gray-700 mb-3 text-lg border-b border-gray-200 pb-2">
                          {category.charAt(0).toUpperCase() + category.slice(1).replace(/([A-Z])/g, ' $1')}
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {items.map(item => (
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
                    ))}
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
      )}
    </div>
  );
};

export default AdminPanel;