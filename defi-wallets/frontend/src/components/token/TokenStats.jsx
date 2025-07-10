// src/components/token/TokenStats.jsx
import TokenStat from "./TokenStat";
import TokenDescription from "./TokenDescription";
import useTokenContract from "../../hooks/useTokenContract";
import { tokenStats } from "../../data/tokenInfo";

const TokenStats = () => {
  // Obtener datos del contrato a través del hook
  const { totalSupply, balance, isLoading, isConnected } = useTokenContract();

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {tokenStats.map((stat) => (
          <TokenStat
            key={stat.id}
            title={stat.title}
            value={
              stat.id === "balance"
                ? isConnected
                  ? isLoading
                    ? "Cargando..."
                    : stat.value(balance, isConnected)
                  : null
                : isConnected // Verificar también la conexión para el totalSupply
                ? isLoading
                  ? "Cargando..."
                  : stat.value(stat.id === "supply" ? totalSupply : null)
                : "0" // Mostrar "0" cuando no está conectado
            }
            suffix={stat.suffix}
            suffixColor={stat.suffixColor}
            badge={stat.badge}
            placeholder={stat.placeholder}
            placeholderClass={stat.placeholderClass}
            valueClass={stat.valueClass}
          />
        ))}
      </div>
      <TokenDescription />
    </div>
  );
};

export default TokenStats;
