import { QRCodeSVG } from 'qrcode.react';
import { useLocation } from 'react-router-dom';
import logo from '../assets/logo-alto-astral.png'; // Caminho do seu logo
import { FaReceipt } from 'react-icons/fa'; // Ícone da comanda

const QRGenerator = () => {
  const location = useLocation();
  const baseUrl = window.location.origin;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f9fafb] to-[#e2e8f0] p-8 print:bg-white print:p-0">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-5xl font-extrabold text-center mb-12 text-gray-800 tracking-tight print:text-3xl print:mb-6">
          Comandas Digitais
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-10 print:grid-cols-4 print:gap-4">
          {Array.from({ length: 50 }, (_, i) => i + 1).map(tableNumber => (
            <div
              key={tableNumber}
              className="bg-white border border-gray-200 p-6 rounded-2xl shadow-xl flex flex-col items-center print:shadow-none print:border print:p-4"
            >
              {/* Moldura decorativa ao redor do QR Code */}
              <div className="mb-4 p-4 border-4 border-indigo-600 rounded-xl bg-white shadow-inner">
                <QRCodeSVG 
                  value={`${baseUrl}/table/${tableNumber}`}
                  size={140}
                  level="H"
                  includeMargin={true}
                />
              </div>

              {/* Título da comanda */}
              <div className="text-center mt-2">
                <div className="flex items-center justify-center gap-2 mb-2 text-gray-700 print:text-sm">
                  <FaReceipt className="text-xl text-indigo-600 print:hidden" />
                  <span className="font-semibold text-lg">Comanda {tableNumber}</span>
                </div>

                {/* Logo centralizado */}
                <div className="w-full flex justify-center">
                  <img 
                    src={logo}
                    alt="Logo do Restaurante"
                    className="h-10 opacity-90 print:h-8"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QRGenerator;
