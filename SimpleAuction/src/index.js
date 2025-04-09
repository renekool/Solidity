// src/index.js

import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom'; // Importa BrowserRouter
import App from './components/App'; // Importa el componente App
import './css/Global.css'; // Importa el archivo CSS global

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <Router>
      <App />
    </Router>
  </React.StrictMode>
);