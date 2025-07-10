// src/components/token/WalletInfo.jsx
import React, { useState } from "react";
import { Card, Button } from "../ui";
import useWallet from "../../hooks/useWallet";

const WalletInfo = () => {
  const {
    isConnected,
    account,
    balance,
    currencySymbol, // Usar el símbolo de moneda de la wallet
    disconnect,
    getNetworkName,
    handleConnectWallet,
    getShortAddress,
  } = useWallet();

  // Estado para la notificación de copiado
  const [showCopied, setShowCopied] = useState(false);

  // Manejar la desconexión sin refrescar la página
  const handleDisconnect = (event) => {
    if (event) event.preventDefault();

    // Ejecutar la desconexión
    disconnect();
  };

  // Función para copiar al portapapeles con notificación
  const copyToClipboard = () => {
    if (account) {
      navigator.clipboard.writeText(account);
      setShowCopied(true);

      // Ocultar la notificación después de 2 segundos
      setTimeout(() => {
        setShowCopied(false);
      }, 2000);
    }
  };

  if (!isConnected) {
    return (
      <div className="text-center py-10">
        <div className="h-16 w-16 mx-auto bg-gradient-to-b from-[#2d3748] to-[#1e293b] rounded-full flex items-center justify-center mb-5 shadow-xl">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
        </div>
        <h3 className="text-xl font-medium mb-3">Connect your wallet</h3>
        <p className="text-gray-400 mb-6 max-w-md mx-auto">
          Connect a wallet to interact with Simple DeFi Token and access all
          features
        </p>
        <Button
          variant="primary"
          onClick={handleConnectWallet}
          className="px-6 py-3">
          Connect Wallet
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <h2 className="text-xl font-bold mb-5 text-[#1eb980]">
        Wallet Connected
      </h2>

      <Card className="p-4">
        <p className="text-sm font-medium text-gray-400 mb-2">
          Account Address
        </p>
        <div className="flex items-center justify-between">
          <div className="font-mono text-sm overflow-hidden overflow-ellipsis">
            {getShortAddress()}
          </div>
          <div className="relative">
            <button
              onClick={copyToClipboard}
              className="ml-2 text-[#1eb980] hover:text-[#1eb980]/80 transition-colors">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
            </button>
            {/* Notificación de copiado */}
            {showCopied && (
              <div className="absolute top-full right-0 mt-2 bg-[#1eb980] text-white text-xs py-1 px-2 rounded shadow-lg">
                ¡Copiado!
              </div>
            )}
          </div>
        </div>
      </Card>

      <Card className="p-4">
        <p className="text-sm font-medium text-gray-400 mb-2">Network</p>
        <div className="flex items-center">
          <div className="h-3 w-3 rounded-full bg-[#1eb980] mr-2 animate-pulse"></div>
          <p className="font-medium">{getNetworkName()}</p>
        </div>
      </Card>

      <Card className="p-4">
        <p className="text-sm font-medium text-gray-400 mb-2">Your Balance</p>
        <div className="flex items-baseline">
          <p className="text-2xl font-bold">
            {Number(balance).toLocaleString()}
          </p>
          <span className="ml-2 text-base text-[#1eb980]">
            {currencySymbol}
          </span>
        </div>
      </Card>

      <div className="mt-6 pt-4 border-t border-[#4a5568]">
        <button
          onClick={handleDisconnect}
          className="text-gray-400 hover:text-gray-300 text-sm flex items-center transition-colors group">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 mr-1 group-hover:text-red-400 transition-colors"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
          Disconnect Wallet
        </button>
      </div>
    </div>
  );
};

export default WalletInfo;
