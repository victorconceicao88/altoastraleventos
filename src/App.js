import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminPanel from './components/AdminPanel';
import ClientInterface from './components/ClientInterface';
import QRGenerator from './components/QRGenerator';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50"> {/* Classes do Tailwind */}
        <Routes>
          <Route path="/" element={<AdminPanel />} />
          <Route path="/table/:tableNumber" element={<ClientInterface />} />
          <Route path="/qr-codes" element={<QRGenerator />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;