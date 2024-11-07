// src/components/HighestBid.js

import React from 'react';
import '../css/HighestBid.css';
import { shortenAddress } from '../utils/utils.js'; // Importar la función desde utils.js

function HighestBid({ highestBid, highestBidder }) {
  const displayAddress = shortenAddress(highestBidder);

  return (
    <div className="highest-bid-container">
      <h2>Oferta actual</h2>
      <p>La oferta líder de la subasta hasta ahora es:</p>
      <div className="highest-bid-content">
        <div className="highest-bid-details">
          <span className="wallet-address">{displayAddress}</span>
          <span className="wallet-label">WALLET</span>
        </div>
        <div className="highest-bid-amount">
          <span className="bid-amount"> {parseFloat(highestBid).toFixed(2)} </span>
          <span className="currency-label">ETH</span>
        </div>
      </div>
    </div>
  );
}

export default HighestBid;