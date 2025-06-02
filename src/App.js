import { BrowserRouter as Router, Routes, Route, useParams } from 'react-router-dom';
import AdminPanel from './components/AdminPanel';
import ClientInterface from './components/ClientInterface';
import QRGenerator from './components/QRGenerator';

// Wrapper para passar o parâmetro da URL como prop
function ClientInterfaceWrapper() {
  const { tableNumber } = useParams();
  return <ClientInterface tableNumber={tableNumber} />;
}

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/" element={<HomePage />} />
          <Route path="/table/:tableNumber" element={<ClientInterfaceWrapper />} />
          <Route path="/qr-codes" element={<QRGenerator />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
    </Router>
  );
}

function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-gray-100 to-gray-200">
      <div className="text-center max-w-2xl px-6">
        <h1 className="text-4xl font-bold mb-6 text-gray-800">Sistema de Gestão Alto Astral</h1>
        <p className="text-lg text-gray-600 mb-10">
          Plataforma integrada para gerenciamento de pedidos, mesas e operações do estabelecimento
        </p>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <h2 className="text-xl font-semibold mb-3 text-gray-700">Painel de Gestão</h2>
            <p className="text-gray-500 mb-4">
              Acesso completo ao sistema de administração do restaurante
            </p>
            <a 
              href="/admin" 
              className="inline-block bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition w-full text-center"
            >
              Acessar Painel
            </a>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <h2 className="text-xl font-semibold mb-3 text-gray-700">Gerador de QR Codes</h2>
            <p className="text-gray-500 mb-4">
              Crie QR Codes para as mesas e facilite o acesso dos clientes
            </p>
            <a 
              href="/qr-codes" 
              className="inline-block bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition w-full text-center"
            >
              Gerar QR Codes
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold mb-4">404 - Página não encontrada</h1>
      <a href="/" className="mt-6 text-indigo-600 hover:underline">
        Voltar para a página inicial
      </a>
    </div>
  );
}

export default App;