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
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-3xl font-bold mb-8">Sistema de Pedidos - Restaurante</h1>
      <div className="flex space-x-4">
        <a href="/admin" className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition">
          Painel do Garçom
        </a>
        <a href="/qr-codes" className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition">
          Gerar QR Codes
        </a>
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
