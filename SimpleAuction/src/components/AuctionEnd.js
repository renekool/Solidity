// src/components/AuctionEnd.js

import React from 'react';
import '../css/AuctionEnd.css';
import { shortenAddress } from '../utils/utils.js';

function AuctionEnd({ account, onEndAuction, highestBidder, highestBid, auctionStatus }) {
  const displayAddress = shortenAddress(highestBidder);

  return (
    <div className="auction-end-container">
      <div className="auction-end-left">
        <h2>Finalizar la subasta</h2>
        <p>Da por finalizado la subasta que estamos haciendo</p>
        <button
          className="end-auction-button"
          onClick={onEndAuction}
          disabled={!account || auctionStatus === "FINALIZADA"}
        >
          Finalizar Subasta
        </button>
        <span className="auction-status">Estado: <span className="bold-status">{auctionStatus}</span></span>
      </div>
      <div className="auction-end-right">
        <h2>Ganador de la Subasta</h2>
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
    </div>
  );
}

export default AuctionEnd;