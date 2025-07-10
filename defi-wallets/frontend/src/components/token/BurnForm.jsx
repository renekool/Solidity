// src/components/token/BurnForm.jsx
import { useState } from "react";
import { Button, Card, Input, Badge } from "../ui";
import useTokenContract from "../../hooks/useTokenContract";

const BurnForm = () => {
  // Estado local del formulario
  const [recipientAddress, setRecipientAddress] = useState("");
  const [amount, setAmount] = useState("");

  // Datos y acciones del contrato a través del hook
  const { transferWithBurn, isBurning, error, isConnected } =
    useTokenContract();

  // Handler para la transferencia con quema
  const handleBurnTransfer = async () => {
    if (!isConnected || !recipientAddress || !amount) return;

    const success = await transferWithBurn(recipientAddress, amount);

    // Si fue exitoso, limpiar el formulario
    if (success) {
      setRecipientAddress("");
      setAmount("");
    }
  };

  return (
    <div className="animate-fadeIn">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-red-400">Transfer with Burn</h2>
        <Badge variant="danger">10% Burn Rate</Badge>
      </div>

      <div className="space-y-5">
        {error && (
          <div className="bg-red-500/10 rounded-lg p-4 text-sm text-red-400">
            {error}
          </div>
        )}

        <Input
          label="Recipient Address"
          name="burnRecipientAddress"
          placeholder="0x..."
          value={recipientAddress}
          onChange={(e) => setRecipientAddress(e.target.value)}
        />

        <Input
          label="Amount (10% will be burnt)"
          name="burnTransferAmount"
          type="number"
          placeholder="0.0"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          suffix="SDFT"
        />

        <Button
          variant="danger"
          onClick={handleBurnTransfer}
          disabled={!isConnected || isBurning || !recipientAddress || !amount}
          className="w-full py-3 mt-2">
          {isBurning ? "Procesando..." : "Transfer with Burn"}
        </Button>

        <div className="bg-red-500/10 rounded-lg p-4 text-sm text-gray-300 flex items-start mt-4">
          <svg
            className="h-5 w-5 text-red-400 mr-3 flex-shrink-0 mt-0.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p>
            When using burn transfer, 10% of tokens are permanently removed from
            circulation, reducing total supply and potentially increasing value
            of remaining tokens.
          </p>
        </div>
      </div>
    </div>
  );
};

export default BurnForm;
