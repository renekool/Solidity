// src/components/HomePage.js

import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/Home.css';

function Home() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/auction');
  };

  return (
    <div className="home-container">
      <h3>¡Bienvenido a la subasta de oportunidades!</h3>
      <h1>¿Quién será el próximo ganador?</h1>
      <button onClick={handleClick}>Ir a la subasta</button>
    </div>
  );
}

export default Home;