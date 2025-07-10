# Staking UI - Interface de staking de tokens

## 🧩 Problem to Solve

**Objective**: Build a staking system where users can:

1. Stake their ERC20 tokens into the contract.
2. Earn rewards based on the duration their tokens remain locked.
3. Withdraw their tokens and rewards after meeting certain conditions.

**Restrictions**:

- Only tokens approved by the contract can be staked.
- Rewards are calculated proportionally based on the staked amount and time.
- A reward rate system will be implemented to manage varying reward rates.

---

## 🔄 Contract Flow

1. **Stake**:  
   Users send a specific amount of ERC20 tokens to the contract. The system records both the amount and the timestamp of the transaction.

2. **Rewards**:  
   Rewards are calculated based on:

   - Amount of tokens staked
   - Duration of the stake
   - A fixed reward rate (e.g., 5% per day)

3. **Unstake**:  
   Once the minimum lock period is met, users can withdraw both their original tokens and the accrued rewards.

4. **Owner Controls**:
   - Set the reward rate
   - Define the lock time
   - Approve which tokens are allowed for staking and rewarding

---

## 🛠 Contract Design

1. **Base Structure**:

   - ERC20 token used for staking (`StakingToken`)
   - ERC20 token used for rewards (`RewardToken`)
   - A `StakingPlatform` smart contract that handles staking logic and reward distribution

2. **Key Functions**:

   - `stake(uint256 amount)`: Users stake tokens into the contract
   - `unstake()`: Users withdraw their staked tokens plus rewards
   - `calculateRewards()`: Calculates rewards based on time and staked amount
   - `setRewardRate(uint256 rate)`: Owner sets the current reward rate

3. **Data Structures**:
   - `mapping` to track each user's staked amount
   - `mapping` to track last interaction timestamp (for reward calculations)
   - Global variables to manage reward rate and reward token supply

---

## 💻 Technologies Used

This project is built with modern tools and libraries for both frontend and smart contract development.

### Frontend:

- Vite
- React
- TypeScript
- Tailwind CSS
- shadcn-ui
- Web3.js / ethers.js
- Bootstrap (UI framework)
- Metamask (Wallet integration)

### Smart Contracts:

- Solidity
- Remix IDE
- Hardhat (Testing & deployment framework)
- Truffle + Ganache (Local testing suite)
- OpenZeppelin (Secure contract templates)

### Development Tools:

- Visual Studio Code (IDE)

---

## ⚠️ Disclaimer

> **This is only a proof of concept.**
>
> The purpose of this project was to learn how to develop a complete decentralized application (dApp) — from the frontend user interface to the backend smart contract logic.  
> **Do not use this code in production** without thorough audits and improvements.

---

## 🚀 Getting Started

To run the project locally:

```bash
git clone https://github.com/yourusername/staking-platform.git
cd staking-platform
npm install
npm run dev
```
