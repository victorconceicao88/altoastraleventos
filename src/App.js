import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminPanel from './components/AdminPanel';
import ClientInterface from './components/ClientInterface';
import QRGenerator from './components/QRGenerator';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          {/* Rota para o painel administrativo */}
          <Route path="/admin" element={<AdminPanel />} />
          
          {/* Rota principal (página inicial) */}
          <Route path="/" element={
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
          } />
          
          {/* Rota para a interface do cliente */}
          <Route path="/table/:tableNumber" element={<ClientInterface />} />
          
          {/* Rota para gerar QR Codes */}
          <Route path="/qr-codes" element={<QRGenerator />} />
          
          {/* Rota de fallback para páginas não encontradas */}
          <Route path="*" element={
            <div className="flex flex-col items-center justify-center h-screen">
              <h1 className="text-4xl font-bold mb-4">404</h1>
              <p className="text-xl">Página não encontrada</p>
              <a href="/" className="mt-6 text-indigo-600 hover:underline">
                Voltar para a página inicial
              </a>
            </div>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;