// Auction.js
import React, { useState } from 'react';
import Navbar from './Navbar';
import BidForm from './BidForm';
import HighestBid from './HighestBid';
import BidList from './BidList';
import AuctionEnd from './AuctionEnd';
import '../css/Auction.css';

function Auction() {
  const [account, setAccount] = useState(null);
  const [auctionContract, setAuctionContract] = useState(null);
  const [highestBid, setHighestBid] = useState(0.0);
  const [highestBidder, setHighestBidder] = useState("0x0000...0000");
  const [bids, setBids] = useState([]);
  const [auctionStatus, setAuctionStatus] = useState("DESCONECTADO");

  const handleEndAuction = async () => {
    if (auctionContract && account) {
      try {
        // Configurar handleRevert antes de realizar la transacción
        window.web3.eth.handleRevert = true;

        await auctionContract.methods.endAuction().send({ from: account, gas: 300000 });
        setAuctionStatus("FINALIZADA");
        alert("La subasta ha sido finalizada con éxito.");
      } catch (error) {
        console.error("Error al finalizar la subasta:", error);

        // Intentar capturar el error personalizado
        if (error && error.data && error.data.message) {
          const errorMessage = error.data.message.toLowerCase();
          console.error("Error con data:", errorMessage);

          if (errorMessage.includes("unauthorized")) {
            alert("Error: No tienes permisos para ejecutar esta función. Solo el propietario puede finalizar la subasta.");
          } else if (errorMessage.includes("auctionalreadyended")) {
            alert("Error: La subasta ya ha finalizado.");
          } else {
            alert("Error desconocido al finalizar la subasta. Consulta la consola para más detalles.");
          }
        } else {
          alert("Error: Hubo un problema al finalizar la subasta. Por favor, revisa la consola para más detalles.");
        }
      }
    }
  };

  const addBidToHistory = (bid) => {
    setBids((prevBids) => [...prevBids, bid]);
  };

  const clearBids = () => {
    setBids([]); // Limpiar la lista de ofertas
  };

  return (
    <div>
      <Navbar
        account={account}
        setAccount={setAccount}
        setAuctionContract={setAuctionContract}
        setHighestBid={setHighestBid}
        setHighestBidder={setHighestBidder}
        setAuctionStatus={setAuctionStatus}
        auctionStatus={auctionStatus}
        clearBids={clearBids} // Pasar la función clearBids a Navbar
      />
      <div className="auction-container">
        <div className="bid-form-wrapper">
          <BidForm
            account={account}
            auctionContract={auctionContract}
            setHighestBid={setHighestBid}
            setHighestBidder={setHighestBidder}
            addBidToHistory={addBidToHistory}
            auctionStatus={auctionStatus}
          />
        </div>
        <div className="highest-bid-wrapper">
          <HighestBid highestBid={highestBid} highestBidder={highestBidder} />
        </div>
        <div className="bid-list-wrapper">
          <BidList bids={bids} />
        </div>
        <div className="auction-end-wrapper">
          <AuctionEnd
            account={account}
            onEndAuction={handleEndAuction}
            highestBidder={highestBidder}
            highestBid={highestBid}
            auctionStatus={auctionStatus}
          />
        </div>
      </div>
    </div>
  );
}

export default Auction;