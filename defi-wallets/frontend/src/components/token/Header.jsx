// src/components/token/Header.jsx
import React, { useState } from "react";
import { Button } from "../ui";
import useWallet from "../../hooks/useWallet";

const Header = () => {
  const { isConnected, handleConnectWallet, isConnecting, getShortAddress } =
    useWallet();

  return (
    <header className="flex justify-between items-center mb-12">
      <div className="flex items-center">
        <div className="h-10 w-10 bg-[#1eb980] rounded-lg flex items-center justify-center mr-3 shadow-lg">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-[#1eb980]">DeFi Hub</h1>
      </div>

      <Button
        variant={isConnected ? "secondary" : "primary"}
        onClick={handleConnectWallet}
        disabled={isConnecting}>
        {isConnecting
          ? "Conectando..."
          : isConnected
          ? getShortAddress()
          : "Connect Wallet"}
      </Button>
    </header>
  );
};

export default Header;
