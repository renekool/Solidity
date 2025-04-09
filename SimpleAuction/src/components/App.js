// src/components/App.js

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './Home';
import Auction from './Auction';
import '../css/Global.css'; // Importa los estilos globales

function App() {
  return (
    <div className="app-container">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auction" element={<Auction />} />
      </Routes>
    </div>
  );
}

export default App;