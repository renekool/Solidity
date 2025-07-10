# 🪙 DeFi Application - Full Stack Development

## 🧩 Problem to Solve

**Objective**: Build a complete decentralized application (DApp) that demonstrates fundamental DeFi concepts and interactions:

1. Create and deploy a custom ERC20 token (Simple DeFi Token - SDFT).
2. Implement basic token operations through a web interface.
3. Connect DeFi wallets (MetaMask, WalletConnect) to interact with smart contracts.
4. Demonstrate both reading blockchain data and executing transactions.
5. Showcase token transfer mechanisms including a custom burn feature.

**Learning Goals**:

- Understand full-stack DeFi development from smart contracts to frontend
- Master wallet integration and blockchain connectivity
- Implement secure transaction patterns and error handling
- Learn modern Web3 development tools and libraries

---

## 🔄 Application Flow

1. **Token Creation**:  
   Deploy a Simple DeFi Token (SDFT) smart contract with initial supply of 1,000,000 tokens using OpenZeppelin's ERC20 implementation.

2. **Wallet Connection**:  
   Users connect their Web3 wallets through multiple connector options:

   - Injected connectors (MetaMask, Trust Wallet, etc.)
   - WalletConnect for mobile and desktop wallets

3. **Token Operations**:

   - **Read Data**: Display total token supply and user's current balance
   - **Normal Transfer**: Standard ERC20 token transfer between addresses
   - **Transfer with Burn**: Custom function that burns 10% of tokens during transfer

4. **Transaction Management**:
   - Real-time transaction status updates
   - Transaction hash tracking for blockchain verification
   - Automatic balance updates after successful transactions

---

## 🛠 Application Architecture

1. **Smart Contract Layer**:

   - `SimpleDeFiToken.sol`: Custom ERC20 token with burn functionality
   - `transferWithAutoBurn()`: Burns 10% of transfer amount automatically
   - OpenZeppelin integration for secure, standard implementations

2. **Frontend Application**:

   - React-based user interface with Material UI components
   - Web3 wallet integration with multiple connector support
   - Real-time blockchain data fetching and transaction management

3. **Key Features Implemented**:
   - Token balance display and total supply reading
   - Dual transfer mechanisms (normal and burn)
   - Wallet connection status management
   - Transaction progress tracking and notifications

---

## 💻 Technologies Used

This project is built with modern tools and libraries for both frontend and smart contract development.

### Frontend:

- **Vite** - Build tool and development server
- **React** - Frontend framework
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **Zustand** - State management
- **RainbowKit** - Wallet connection UI
- **Wagmi** - React hooks for Ethereum
- **ethers.js** - Ethereum library for blockchain interactions

### Smart Contracts:

- **Solidity** - Smart contract programming language
- **Truffle** - Development framework
- **Ganache** - Local blockchain for testing
- **OpenZeppelin** - Secure contract templates and utilities
- **Hardhat** - Alternative development environment (mentioned in documentation)

### Web3 Integration:

- **ConnectKit** - Wallet connection components
- **Web3Modal** - Universal wallet modal
- **Wagmi** - React hooks for Ethereum
- **Viem** - TypeScript interface for Ethereum

### Development Tools:

- **Node.js** - JavaScript runtime environment
- **npm** - Package manager
- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixing

### Testing & Deployment:

- **Truffle Test Suite** - Smart contract testing
- **Local Ganache Network** - Development blockchain
- **dotenv** - Environment variable management

---

## ⚠️ Disclaimer

> **This is only a proof of concept.**
>
> The purpose of this project was to learn how to develop a complete decentralized application (dApp) — from the frontend user interface to the backend smart contract logic, including wallet integration and basic token operations.  
> **Do not use this code in production** without thorough audits and improvements.

---

## 🚀 Getting Started

To run the project locally:

```bash
git clone https://github.com/yourusername/defi-application.git
cd defi-application
npm install
npm run dev
```
