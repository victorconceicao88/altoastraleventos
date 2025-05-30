import { QRCodeCanvas } from 'qrcode.react';
import { FaReceipt, FaPrint } from 'react-icons/fa';
import { useEffect, useRef, useState } from 'react';
import logo from '../assets/logo-alto-astral.png';

const QRGenerator = () => {
  const baseUrl = window.location.origin;
  const [qrImages, setQrImages] = useState(Array(50).fill(null));
  const [logoBase64, setLogoBase64] = useState('');
  const canvasRefs = useRef(Array(50).fill(null));

  // Converter logo para base64
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
      console.error('Erro ao carregar o logo');
      setLogoBase64('');
    };
  }, []);

  // Capturar QR Codes como imagens
  useEffect(() => {
    const timer = setTimeout(() => {
      const images = canvasRefs.current.map((ref) => {
        return ref ? ref.toDataURL('image/png') : null;
      });
      setQrImages(images);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handlePrint = () => {
    if (!logoBase64 || qrImages.some(img => !img)) {
      alert('Aguarde o carregamento completo dos QR Codes e logo...');
      return;
    }

    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Comandas Premium - HyperGram Ultra</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap');
            
            body {
              font-family: 'Poppins', sans-serif;
              margin: 0;
              padding: 20px;
              background: #f8f9fa;
            }
            
            .print-header {
              text-align: center;
              margin-bottom: 30px;
            }
            
            .cards-grid {
              display: grid;
              grid-template-columns: repeat(3, 1fr);
              gap: 20px;
              max-width: 1000px;
              margin: 0 auto;
            }
            
            .credit-card {
              background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
              border-radius: 16px;
              padding: 25px;
              color: white;
              box-shadow: 0 8px 25px rgba(0,0,0,0.15);
              position: relative;
              overflow: hidden;
              height: 200px;
              display: flex;
              flex-direction: column;
              justify-content: space-between;
              page-break-inside: avoid;
              border: 1px solid rgba(255,255,255,0.2);
            }
            
            .card-header {
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-bottom: 15px;
            }
            
            .card-logo {
              height: 40px;
              max-width: 120px;
              object-fit: contain;
              filter: brightness(0) invert(1) drop-shadow(0 0 5px rgba(255,255,255,0.3));
            }
            
            .qr-container {
              background: white;
              padding: 10px;
              border-radius: 12px;
              width: 100px;
              height: 100px;
              margin: 0 auto;
              display: flex;
              align-items: center;
              justify-content: center;
              box-shadow: 0 4px 10px rgba(0,0,0,0.1);
            }
            
            .qr-container img {
              width: 100%;
              height: 100%;
              object-fit: contain;
            }
            
            .card-type {
              font-size: 16px;
              letter-spacing: 1.5px;
              text-align: center;
              margin-top: 15px;
              font-weight: 700;
              text-shadow: 0 2px 4px rgba(0,0,0,0.2);
              text-transform: uppercase;
            }
            
            .card-number {
              font-size: 24px;
              text-align: center;
              font-weight: 700;
              margin: 5px 0;
            }
            
            .card-label {
              font-size: 13px;
              text-align: center;
              opacity: 0.9;
              margin-bottom: 8px;
              text-transform: uppercase;
              letter-spacing: 1px;
            }
            
            .card-footer {
              display: flex;
              justify-content: space-between;
              font-size: 11px;
              margin-top: 15px;
              opacity: 0.8;
            }
            
            .card-corner {
              position: absolute;
              width: 80px;
              height: 80px;
              background: rgba(255,255,255,0.08);
              border-radius: 50%;
            }
            
            .corner-1 {
              top: -30px;
              left: -30px;
            }
            
            .corner-2 {
              bottom: -30px;
              right: -30px;
            }
            
            .card-stripe {
              position: absolute;
              top: 40px;
              left: 0;
              width: 100%;
              height: 20px;
              background: rgba(0,0,0,0.15);
            }
            
            .card-id {
              font-size: 12px;
              opacity: 0.8;
              font-weight: 600;
            }
            
            @page {
              size: A4 landscape;
              margin: 15mm;
            }
            
            @media print {
              body {
                background: white;
                padding: 10px;
              }
              
              .cards-grid {
                grid-template-columns: repeat(3, 1fr) !important;
                gap: 15px !important;
              }
            }
          </style>
        </head>
        <body>
          <div class="print-header">
            <h1 style="font-size: 28px; margin-bottom: 5px; color: #1e3c72;">HyperGram Ultra</h1>
            <p style="font-size: 16px; color: #555;">Comandas Digitais Premium</p>
          </div>
          <div class="cards-grid">
            ${Array.from({ length: 50 }, (_, i) => {
              const tableNumber = i + 1;
              const cardType = tableNumber <= 18 ? 'MESA' : 'COMANDA';
              return `
                <div class="credit-card">
                  <div class="card-corner corner-1"></div>
                  <div class="card-corner corner-2"></div>
                  <div class="card-stripe"></div>
                  
                  <div class="card-header">
                    <div class="card-id">#${String(tableNumber).padStart(2, '0')}</div>
                    <img src="${logoBase64}" class="card-logo" alt="Logo" />
                  </div>
                  
                  <div class="qr-container">
                    <img src="${qrImages[i]}" alt="QR Code" />
                  </div>
                  
                  <div class="card-type">${cardType}</div>
                  <div class="card-number">${tableNumber}</div>
                  
                  <div class="card-label">Digital Menu</div>
                  
                  <div class="card-footer">
                    <span>www.hypergram.com.br</span>
                    <span>Scan Me</span>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
          <script>
            setTimeout(() => {
              window.print();
              window.close();
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
          <span className="font-medium">Imprimir Comandas Premium</span>
        </button>
      </div>

      <header className="text-center mb-10">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-800 tracking-tight mb-4">
          HyperGram Ultra
        </h1>
        <p className="text-lg text-gray-600 font-medium">Comandas Digitais Premium</p>
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
                className="bg-white border-2 border-gray-100 p-5 rounded-2xl shadow-lg flex flex-col items-center transition-all hover:shadow-xl hover:-translate-y-1"
              >
                <div className="mb-4 p-3 border-4 border-indigo-500 rounded-xl bg-white shadow-inner w-fit">
                  <QRCodeCanvas
                    value={qrUrl}
                    size={140}
                    level="H"
                    includeMargin={true}
                    ref={(el) => (canvasRefs.current[i] = el)}
                  />
                </div>

                <div className="text-center mt-2 w-full">
                  <div className="flex items-center justify-center gap-2 mb-2 text-gray-700">
                    <FaReceipt className="text-xl text-indigo-600" />
                    <span className="font-semibold text-lg">{label}</span>
                  </div>

                  <div className="w-full flex justify-center">
                    <img
                      src={logo}
                      alt="Logo do Restaurante"
                      className="h-12 opacity-90"
                    />
                  </div>
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