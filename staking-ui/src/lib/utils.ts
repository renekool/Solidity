import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatAddress = (address: string): string => {
  if (!address || address.length < 10) return address; // Manejo de error para direcciones inválidas
  return `${address.substring(0, 6)}...${address.substring(
    address.length - 4
  )}`;
};

// Función para formatear números grandes
export const formatLargeNumber = (value: number | string) => {
  const num = Number(value);
  if (isNaN(num)) return "0.00";
  if (num >= 1e9) {
    return (num / 1e9).toFixed(2) + "B";
  } else if (num >= 1e6) {
    return (num / 1e6).toFixed(2) + "M";
  } else if (num >= 1e3) {
    return (num / 1e3).toFixed(2) + "K";
  }
  return num.toFixed(4);
};
