import { QRCodeCanvas } from 'qrcode.react';
import { FaReceipt, FaPrint } from 'react-icons/fa';
import { useEffect, useRef, useState } from 'react';
import logo from '../assets/logo-alto-astral.png';

const QRGenerator = () => {
  const baseUrl = window.location.origin;
  const [qrImages, setQrImages] = useState(Array(50).fill(null));
  const [logoBase64, setLogoBase64] = useState('');
  const canvasRefs = useRef(Array(50).fill(null));

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
              grid-template-columns: repeat(3, 1fr);
              gap: 8mm;
              max-width: 280mm;
              margin: 0 auto;
            }
            
            .credit-card {
              background: white;
              border-radius: 8px;
              padding: 8px;
              color: black;
              box-shadow: 0 4px 10px rgba(0,0,0,0.1);
              position: relative;
              overflow: hidden;
              width: 85.6mm;
              height: 53.98mm;
              display: flex;
              flex-direction: column;
              justify-content: space-between;
              page-break-inside: avoid;
              border: 2px solid #3b82f6;
              box-sizing: border-box;
            }
            
            .card-header {
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-bottom: 2px;
            }
            
            .card-logo {
              height: 32px;
              max-width: 85px;
              object-fit: contain;
              filter: none;
              margin: 0 auto;
              display: block;
            }
            
            .qr-container {
              background: white;
              padding: 2px;
              border-radius: 5px;
              width: 60px;
              height: 60px;
              margin: 0 auto;
              display: flex;
              align-items: center;
              justify-content: center;
              box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            }
            
            .qr-container img {
              width: 100%;
              height: 100%;
              object-fit: contain;
            }
            
            .card-type {
              font-size: 10px;
              letter-spacing: 0.5px;
              text-align: center;
              margin-top: 2px;
              font-weight: 600;
              text-transform: uppercase;
              color: #333;
            }
            
            .card-number {
              font-size: 15px;
              text-align: center;
              font-weight: 700;
              margin: 0;
              color: #1a202c;
            }

            .card-label {
              font-size: 8px;
              text-align: center;
              opacity: 0.8;
              margin-bottom: 2px;
              text-transform: uppercase;
              letter-spacing: 0.5px;
              color: #555;
            }

            .card-footer {
              display: none;
            }
            
            .card-id {
              font-size: 8px;
              opacity: 0.8;
              font-weight: 600;
              color: #444;
            }
            
            .card-icon {
              position: absolute;
              bottom: 6px;
              left: 6px;
              font-size: 12px;
              opacity: 0.6;
              color: #3b82f6;
            }

            .card-corner, .card-stripe {
                display: none;
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
                grid-template-columns: repeat(3, 1fr) !important;
                gap: 7mm !important;
                margin: 0 auto;
                max-width: 280mm;
                padding: 5mm;
              }
              
              .credit-card {
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
                width: 85.6mm;
                height: 53.98mm;
              }
            }
          </style>
        </head>
        <body>
          <div class="print-header">
            <h1 style="font-size: 18px; margin-bottom: 2px; color: #1e3c72;">Alto Astral</h1>
            <p style="font-size: 10px; color: #555;">Comandas Digitais</p>
          </div>
          <div class="cards-grid">
            ${Array.from({ length: 50 }, (_, i) => {
              const tableNumber = i + 1;
              const cardType = tableNumber <= 18 ? 'MESA' : 'COMANDA';
              return `
                <div class="credit-card">
                  <div class="card-header">
                    <div class="card-id">#${String(tableNumber).padStart(2, '0')}</div>
                  </div>
                  
                  <div class="qr-container">
                    <img src="${qrImages[i]}" alt="QR Code" />
                  </div>
                  
                  <div class="card-type">${cardType}</div>
                  <div class="card-number">${tableNumber}</div>
                  
                  <div class="card-label">Menu Digital</div>

                  <div style="text-align: center; margin-top: 3px;">
                    <img src="${logoBase64}" class="card-logo" alt="Logo Alto Astral" />
                  </div>
                  
                  <div class="card-icon">🍽️</div>
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
          <span className="font-medium">Imprimir Comandas</span>
        </button>
      </div>

      <header className="text-center mb-10">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-800 tracking-tight mb-4">
          Comandas Digitais
        </h1>
        <p className="text-lg text-gray-600">Escaneie o QR Code para acessar o menu digital</p>
      </header>

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 sm:gap-8">
          {Array.from({ length: 50 }, (_, i) => {
            const tableNumber = i + 1;
            const qrUrl = `${baseUrl}/table/${tableNumber}`;
            const label = getLabel(tableNumber);

            return (
              <div
                key={tableNumber}
                className="bg-white border-2 border-blue-500 p-3 rounded-xl shadow-lg flex flex-col items-center justify-between transition-all hover:shadow-xl hover:-translate-y-1"
                style={{ width: '85.6mm', height: '53.98mm', boxSizing: 'border-box' }}
              >
                <div className="text-center w-full">
                  <div className="flex items-center justify-between mb-1 text-gray-700">
                    <span className="font-semibold text-sm">#{String(tableNumber).padStart(2, '0')}</span>
                    <FaReceipt className="text-base text-blue-600" />
                  </div>
                </div>
                
                <div className="mb-2 p-1 border border-gray-200 rounded-lg bg-white shadow-sm w-fit">
                  <QRCodeCanvas
                    value={qrUrl}
                    size={65}
                    level="H"
                    includeMargin={true}
                    ref={(el) => (canvasRefs.current[i] = el)}
                  />
                </div>

                <div className="text-center w-full">
                  <p className="font-bold text-base text-gray-900 leading-tight">{label}</p>
                  <p className="text-xs text-gray-600 mb-1">Menu Digital</p>
                  <img
                    src={logo}
                    alt="Logo Alto Astral"
                    className="h-10 mx-auto opacity-90 mt-1"
                  />
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