import { QRCodeCanvas } from 'qrcode.react';
import { FaReceipt, FaPrint } from 'react-icons/fa';
import { useEffect, useRef, useState } from 'react';
import logo from '../assets/logo-alto-astral.png';

const QRGenerator = () => {
  const baseUrl = window.location.origin;
  const totalComandas = 70;
  const [qrImages, setQrImages] = useState(Array(totalComandas).fill(null));
  const [logoBase64, setLogoBase64] = useState('');
  const canvasRefs = useRef(Array(totalComandas).fill(null));

  // Converte o logo para base64
  useEffect(() => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.src = logo;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      setLogoBase64(canvas.toDataURL('image/png'));
    };
    img.onerror = () => {
      console.error('Erro ao carregar o logo. Verifique o caminho e as permissões.');
      setLogoBase64('');
    };
  }, []);

  // Captura os QR Codes como imagens Base64
  useEffect(() => {
    const timer = setTimeout(() => {
      const images = canvasRefs.current.map((ref) => {
        return ref ? ref.toDataURL('image/png') : null;
      });
      setQrImages(images);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Função para lidar com a impressão das comandas
  const handlePrint = () => {
    if (!logoBase64 || qrImages.some(img => !img)) {
      alert('Aguarde o carregamento completo dos QR Codes e do logo antes de imprimir.');
      return;
    }

    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Comandas Digitais - Alto Astral</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap');
            
            body {
              font-family: 'Poppins', sans-serif;
              margin: 0;
              padding: 5mm;
              background: #f8f9fa;
            }
            
            .print-header {
              text-align: center;
              margin-bottom: 15px;
            }
            
            .cards-grid {
              display: grid;
              grid-template-columns: repeat(4, 1fr);
              gap: 5mm;
              max-width: 280mm;
              margin: 0 auto;
            }
            
            .comanda-card {
              background: white;
              border-radius: 8px;
              padding: 12px;
              color: black;
              box-shadow: 0 4px 10px rgba(0,0,0,0.1);
              position: relative;
              overflow: hidden;
              width: 65mm;
              height: 100mm;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: space-between;
              page-break-inside: avoid;
              border: 2px solid #918e89;
              box-sizing: border-box;
            }
            
            .card-header {
              width: 100%;
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-bottom: 8px;
            }
            
            .card-logo {
              height: 32px;
              max-width: 100px;
              object-fit: contain;
              margin: 0 auto 10px;
              display: block;
            }
            
            .qr-container {
              background: white;
              padding: 8px;
              border-radius: 8px;
              width: 120px;
              height: 120px;
              margin: 10px auto;
              display: flex;
              align-items: center;
              justify-content: center;
              box-shadow: 0 2px 5px rgba(0,0,0,0.1);
              border: 1px solid #e2e8f0;
            }
            
            .qr-container img {
              width: 100%;
              height: 100%;
              object-fit: contain;
            }
            
            .card-info {
              text-align: center;
              margin: 15px 0;
            }
            
            .card-type {
              font-size: 12px;
              letter-spacing: 0.5px;
              font-weight: 600;
              text-transform: uppercase;
              color: #333;
              margin-bottom: 5px;
            }
            
            .card-number {
              font-size: 24px;
              font-weight: 700;
              margin: 5px 0;
              color: #1a202c;
            }

            .card-label {
              font-size: 10px;
              opacity: 0.8;
              margin-bottom: 10px;
              text-transform: uppercase;
              letter-spacing: 0.5px;
              color: #555;
            }
            
            .card-id {
              font-size: 10px;
              opacity: 0.8;
              font-weight: 600;
              color: #444;
            }
            
            .card-icon {
              font-size: 14px;
              opacity: 0.6;
              color: #3b82f6;
            }

            @page {
              size: A4 landscape;
              margin: 7mm;
            }
            
            @media print {
              body {
                background: white;
                padding: 0;
              }
              
              .cards-grid {
                grid-template-columns: repeat(4, 1fr) !important;
                gap: 5mm !important;
                margin: 0 auto;
                max-width: 280mm;
                padding: 5mm;
              }
              
              .comanda-card {
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
                width: 65mm;
                height: 100mm;
                border: 2px solid #918e89 !important;
              }
            }
          </style>
        </head>
        <body>
          <div class="print-header">
            <h1 style="font-size: 18px; margin-bottom: 2px; color: #1e3c72;">Alto Astral</h1>
            <p style="font-size: 10px; color: #555;">Comandas Digitais (1-70)</p>
          </div>
          <div class="cards-grid">
            ${Array.from({ length: totalComandas }, (_, i) => {
              const tableNumber = i + 1;
              const cardType = tableNumber <= 18 ? 'MESA' : 'COMANDA';
              return `
                <div class="comanda-card">
                  <div class="card-header">
                    <div class="card-id">#${String(tableNumber).padStart(2, '0')}</div>
                    <div class="card-icon">🍽️</div>
                  </div>
                  
                  <img src="${logoBase64}" class="card-logo" alt="Logo Alto Astral" />
                  
                  <div class="qr-container">
                    <img src="${qrImages[i]}" alt="QR Code" />
                  </div>
                  
                  <div class="card-info">
                    <div class="card-type">${cardType}</div>
                    <div class="card-number">${tableNumber}</div>
                    <div class="card-label">Menu Digital</div>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
          <script>
            setTimeout(() => {
              window.print();
            }, 500);
          </script>
        </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    printWindow.document.write(printContent);
    printWindow.document.close();
  };

  const getLabel = (number) => {
    return number <= 18 ? `Mesa ${number}` : `Comanda ${number}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f9fafb] to-[#e2e8f0] p-6 sm:p-8">
      <div className="flex justify-end mb-4">
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-indigo-700 transition-all transform hover:scale-105"
        >
          <FaPrint className="text-lg" />
          <span className="font-medium">Imprimir Comandas (1-70)</span>
        </button>
      </div>

      <header className="text-center mb-10">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-800 tracking-tight mb-4">
          Comandas Digitais
        </h1>
        <p className="text-lg text-gray-600">Escaneie o QR Code para acessar o menu digital (1-70)</p>
      </header>

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {Array.from({ length: totalComandas }, (_, i) => {
            const tableNumber = i + 1;
            const qrUrl = `${baseUrl}/table/${tableNumber}`;
            const label = getLabel(tableNumber);

            return (
              <div
                key={tableNumber}
                className="bg-white rounded-xl shadow-lg flex flex-col items-center p-4 transition-all hover:shadow-xl hover:-translate-y-1"
                style={{ 
                  width: '65mm', 
                  height: '100mm', 
                  boxSizing: 'border-box',
                  border: '2px solid #918e89'
                }}
              >
                <div className="w-full flex justify-between items-center mb-4">
                  <span className="font-semibold text-sm text-gray-700">#{String(tableNumber).padStart(2, '0')}</span>
                  <FaReceipt className="text-base text-blue-600" />
                </div>
                
                <img
                  src={logo}
                  alt="Logo Alto Astral"
                  className="h-10 mb-6"
                />
                
                <div className="mb-6 p-2 bg-white rounded-lg shadow-sm border border-gray-200">
                  <QRCodeCanvas
                    value={qrUrl}
                    size={120}
                    level="H"
                    includeMargin={true}
                    ref={(el) => (canvasRefs.current[i] = el)}
                  />
                </div>

                <div className="text-center mt-auto">
                  <p className="text-sm font-semibold text-gray-700 mb-1">
                    {tableNumber <= 18 ? 'MESA' : 'COMANDA'}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 mb-2">{tableNumber}</p>
                  <p className="text-xs text-gray-600 uppercase tracking-wider">Menu Digital</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default QRGenerator;