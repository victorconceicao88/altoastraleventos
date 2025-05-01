import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // Importação do arquivo CSS principal
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Opcional (para métricas de performance)
reportWebVitals();