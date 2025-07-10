import { useState } from "react";
import {
  Header,
  TabNavigation,
  TokenStats,
  TransferForm,
  BurnForm,
  WalletInfo,
} from "../components/token";
import useWallet from "../hooks/useWallet";

function TokenDashboard() {
  // Usar el hook useWallet para datos de conexión
  const { isConnected } = useWallet();

  // Estado local para la navegación de tabs
  const [activeTab, setActiveTab] = useState("overview");

  // Definir componentes por tab
  const tabComponents = {
    overview: <TokenStats isConnected={isConnected} />,
    transfer: <TransferForm />,
    burn: <BurnForm />,
    wallet: <WalletInfo />,
  };

  return (
    <div className="min-h-screen bg-[#131a2b] text-white font-sans">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <Header />

        {/* Tabs and Content Container */}
        <div className="rounded-xl overflow-hidden bg-[#1e293b]/70 shadow-xl mx-auto">
          {/* Tab Navigation */}
          <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

          {/* Content Area */}
          <div className="p-8">
            <div className="animate-fadeIn">{tabComponents[activeTab]}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Añadir estilos de animación
const style = document.createElement("style");
style.textContent = `
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  .animate-fadeIn {
    animation: fadeIn 0.3s ease-in-out;
  }
`;
document.head.appendChild(style);

export default TokenDashboard;
