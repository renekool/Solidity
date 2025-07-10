export const tokenStats = [
  {
    id: "supply",
    title: "Total Supply",
    value: (totalSupply) => Number(totalSupply).toLocaleString(),
    suffix: "SDFT",
    suffixColor: "text-green-400",
    valueClass: "text-2xl font-bold",
  },
  {
    id: "balance",
    title: "Your Balance",
    value: (balance, isConnected) =>
      isConnected ? Number(balance).toLocaleString() : null,
    suffix: "SDFT",
    suffixColor: "text-green-400",
    placeholder: "Connect wallet",
    placeholderClass: "text-gray-500 italic",
    valueClass: "text-2xl font-bold",
  },
  {
    id: "burnRate",
    title: "Burn Rate",
    value: () => "10%",
    badge: {
      text: "Deflationary",
      variant: "danger",
    },
    valueClass: "text-2xl font-bold text-red-400",
  },
];
