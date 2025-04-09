// BidForm.js
import React, { useState } from 'react';
import '../css/BidForm.css';

function BidForm({ account, auctionContract, addBidToHistory, setHighestBid, setHighestBidder, auctionStatus }) {
  const [bidAmount, setBidAmount] = useState('');

  const handleBid = async () => {
    if (!auctionContract || !account) {
      alert('Conecta tu wallet antes de hacer una oferta.');
      return;
    }

    if (!bidAmount || isNaN(bidAmount) || bidAmount <= 0) {
      alert('Ingresa una cantidad de oferta válida en ETH.');
      return;
    }

    try {
      const currentHighestBid = await auctionContract.methods.highestBid().call();
      const highestBidInEther = window.web3.utils.fromWei(currentHighestBid, 'ether');

      if (parseFloat(bidAmount) <= parseFloat(highestBidInEther)) {
        alert(`Tu oferta debe ser mayor a la oferta actual de ${highestBidInEther} ETH.`);
        return;
      }

      const bidValue = window.web3.utils.toWei(bidAmount, 'ether');

      const transaction = await auctionContract.methods.bid().send({
        from: account,
        value: bidValue,
        gas: 300000
      });

      alert('Oferta realizada con éxito!');
      
      addBidToHistory({
        transactionHash: transaction.transactionHash,
        address: account,
        amount: bidAmount,
        status: 'Oferta realizada'
      });

      setHighestBid(bidAmount);
      setHighestBidder(account);

      setBidAmount(''); // Limpiar el campo de entrada
    } catch (error) {
      console.error('Error al hacer una oferta:', error);
      alert('Hubo un error al hacer la oferta. Revisa la consola para más detalles.');
    }
  };

  return (
    <div className="bid-form-container">
      <h2>Subasta Simple</h2>
      <p>Ingresa tu oferta para ser el próximo ganador</p>
      <div className="bid-form-row">
        <input
          type="number"
          className="bid-input"
          placeholder="Ingrese tu oferta en ETH"
          value={bidAmount}
          onChange={(e) => setBidAmount(e.target.value)}
          disabled={!account || !auctionContract || auctionStatus === "FINALIZADA"} // Deshabilitar si la subasta ha finalizado
        />
        <button
          className="bid-button"
          onClick={handleBid}
          disabled={!account || !auctionContract || auctionStatus === "FINALIZADA"} // Deshabilitar si la subasta ha finalizado
        >
          Haz una oferta
        </button>
      </div>
    </div>
  );
}

export default BidForm;