// src/components/Navbar.js

import React, { useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import Web3 from 'web3';
import SimpleAuctionABI from '../abis/SimpleAuction.json';
import '../css/Navbar.css';

function Navbar({ account, setAccount, setAuctionContract, setHighestBid, setHighestBidder, setAuctionStatus, auctionStatus, clearBids }) {

  const loadWeb3 = useCallback(async () => {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setAccount(accounts[0]);
      } catch (error) {
        console.error('Error al conectar la wallet:', error);
      }
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      window.alert('Por favor instala MetaMask');
    }
  }, [setAccount]);

  const loadBlockchainData = useCallback(async () => {
    const web3 = window.web3;
    const networkId = await web3.eth.net.getId();
    const auctionNetworkData = SimpleAuctionABI.networks[networkId];

    if (auctionNetworkData) {
      const auctionContractInstance = new web3.eth.Contract(SimpleAuctionABI.abi, auctionNetworkData.address);
      setAuctionContract(auctionContractInstance);
      console.log("Contrato de subasta cargado:", auctionNetworkData.address);

      try {
        const highestBid = await auctionContractInstance.methods.highestBid().call();
        const highestBidder = await auctionContractInstance.methods.highestBidder().call();
        const auctionEnded = await auctionContractInstance.methods.auctionEnded().call();

        setHighestBid(web3.utils.fromWei(highestBid, 'ether'));
        setHighestBidder(highestBidder);
        setAuctionStatus(auctionEnded ? "FINALIZADA" : "ACTIVA");
      } catch (error) {
        console.error("Error al obtener los datos de la subasta:", error);
      }
    } else {
      console.log("No hay un contrato de subasta existente en esta red.");
    }
  }, [setAuctionContract, setHighestBid, setHighestBidder, setAuctionStatus]);

  const handleConnectWallet = useCallback(async () => {
    if (account) {
      setAccount(null);
      setAuctionContract(null);
      setHighestBid('0.0');
      setHighestBidder('0x0000...0000');
      setAuctionStatus("DESCONECTADO");
      console.log("Wallet desconectada");
    } else {
      await loadWeb3();
      await loadBlockchainData();
    }
  }, [account, loadWeb3, loadBlockchainData, setAccount, setAuctionContract, setHighestBid, setHighestBidder, setAuctionStatus]);

  const startNewAuction = async () => {
    if (!account) {
      alert("Conecta tu wallet primero.");
      return;
    }

    const confirmed = window.confirm("¿Deseas iniciar una nueva subasta?");
    if (!confirmed) return;

    const web3 = window.web3;
    const networkId = await web3.eth.net.getId();
    const auctionNetworkData = SimpleAuctionABI.networks[networkId];

    if (auctionNetworkData) {
      const auctionContractInstance = new web3.eth.Contract(SimpleAuctionABI.abi, auctionNetworkData.address);

      try {
        await auctionContractInstance.methods.resetAuction().send({ from: account, gas: 300000 });
        console.log("Subasta reiniciada");
        
        setHighestBid('0.0');
        setHighestBidder('0x0000...0000');
        setAuctionStatus("ACTIVA");
        clearBids();

        alert("La subasta ha sido reiniciada con éxito.");
      } catch (error) {
        console.error("Error al reiniciar la subasta:", error);
      }
    } else {
      alert("No se encontró un contrato de subasta en esta red.");
    }
  };

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          loadBlockchainData();
        } else {
          handleConnectWallet();
        }
      });
    }

    return () => {
      if (window.ethereum && window.ethereum.removeListener) {
        window.ethereum.removeListener('accountsChanged', () => {});
      }
    };
  }, [handleConnectWallet, loadBlockchainData, setAccount]);

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <ul className="navbar-menu">
          <li>
            <Link to="/">Inicio</Link>
          </li>
        </ul>
      </div>
      <div className="navbar-center">
        {account && auctionStatus === "FINALIZADA" && (
          <span className="start-new-auction" onClick={startNewAuction} style={{ cursor: "pointer", color: "blue" }}>
            Iniciar nueva oferta
          </span>
        )}
      </div>
      <div className="navbar-right align-left">
        <button
          className={`navbar-button connect-wallet ${account ? 'connected' : ''}`}
          onClick={handleConnectWallet}
        >
          {account ? `${account.substring(0, 6)}...${account.substring(account.length - 4)}` : 'Conectar wallet'}
        </button>
      </div>
    </nav>
  );
}

export default Navbar;