import { QRCodeSVG } from 'qrcode.react';
import { useLocation } from 'react-router-dom';

const QRGenerator = () => {
  const location = useLocation();
  const baseUrl = window.location.origin;

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">QR Codes para Mesas</h1>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {Array.from({ length: 50 }, (_, i) => i + 1).map(tableNumber => (
            <div key={tableNumber} className="bg-white p-4 rounded-lg shadow-md flex flex-col items-center">
              <div className="mb-2 p-2 bg-gray-50 rounded">
                <QRCodeSVG 
                  value={`${baseUrl}/table/${tableNumber}`}
                  size={120}
                  level="H"
                  includeMargin={true}
                />
              </div>
              <div className="text-center mt-2">
                <p className="font-bold text-lg">Mesa {tableNumber}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QRGenerator;