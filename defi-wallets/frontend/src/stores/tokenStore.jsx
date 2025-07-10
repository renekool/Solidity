import { create } from "zustand";

/**
 * Store global para el estado del token
 */
const useTokenStore = create((set) => ({
  // Datos del token
  totalSupply: "0",
  balance: "0",

  // Estados de UI
  isLoading: false,
  error: null,
  isTransferring: false,
  isBurning: false,

  // Acciones para actualizar el estado
  setTotalSupply: (totalSupply) => set({ totalSupply }),
  setBalance: (balance) => set({ balance }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  setTransferring: (isTransferring) => set({ isTransferring }),
  setBurning: (isBurning) => set({ isBurning }),

  // Reset del estado
  resetState: () =>
    set({
      totalSupply: "0",
      balance: "0",
      isLoading: false,
      error: null,
      isTransferring: false,
      isBurning: false,
    }),
}));

export default useTokenStore;
