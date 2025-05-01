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
          <Route path="/admin" element={<AdminPanel />} />
          
          {/* Rota principal (pode ser a página inicial ou login) */}
          <Route path="/" element={<HomePage />} />
          
          {/* Rota para a interface do cliente */}
          <Route path="/table/:tableNumber" element={<ClientInterface />} />
          
          {/* Rota para o menu digital (acessado via QR Code) */}
          <Route path="/menuData" element={<menuData />} />
          
          {/* Rota para gerar QR Codes */}
          <Route path="/qr-codes" element={<QRGenerator />} />
          
          {/* Rota de fallback para páginas não encontradas */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
    </Router>
  );
}

// Componentes adicionais (você pode movê-los para arquivos separados)
function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-3xl font-bold mb-8">Restaurante App</h1>
      <div className="flex space-x-4">
        <a href="/admin" className="bg-indigo-600 text-white px-6 py-3 rounded-lg">
          Painel do Garçom
        </a>
        <a href="/qr-codes" className="bg-green-600 text-white px-6 py-3 rounded-lg">
          Gerar QR Codes
        </a>
      </div>
    </div>
  );
}

function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold mb-4">404</h1>
      <p className="text-xl">Página não encontrada</p>
      <a href="/" className="mt-6 text-indigo-600 hover:underline">
        Voltar para a página inicial
      </a>
    </div>
  );
}

export default App;