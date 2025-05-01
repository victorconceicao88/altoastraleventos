import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminPanel from './components/AdminPanel';
import ClientInterface from './components/ClientInterface';
import QRGenerator from './components/QRGenerator';
import menuData from './menuData';


function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          {/* Rota para o painel administrativo */}
          <Route path="/" element={<AdminPanel />} />
          
          {/* Rota para a interface do cliente (antiga) */}
          <Route path="/table/:tableNumber" element={<ClientInterface />} />
          
          {/* Rota para a nova página de menu que será acessada via QR Code */}
          <Route path="/menuData" element={<menuData />} />
          
          {/* Rota para gerar QR Codes */}
          <Route path="/qr-codes" element={<QRGenerator />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;