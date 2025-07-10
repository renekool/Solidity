// src/components/token/TransferForm.jsx
import { useState } from "react";
import { Button, Card, Input } from "../ui";
import useTokenContract from "../../hooks/useTokenContract";

const TransferForm = () => {
  // Estado local del formulario
  const [recipientAddress, setRecipientAddress] = useState("");
  const [amount, setAmount] = useState("");

  // Datos y acciones del contrato a través del hook
  const { balance, transfer, isTransferring, error, isConnected } =
    useTokenContract();

  // Handler para la transferencia
  const handleTransfer = async () => {
    if (!isConnected || !recipientAddress || !amount) return;

    const success = await transfer(recipientAddress, amount);

    // Si fue exitoso, limpiar el formulario
    if (success) {
      setRecipientAddress("");
      setAmount("");
    }
  };

  return (
    <div className="animate-fadeIn">
      <h2 className="text-xl font-bold mb-6 text-[#1eb980]">
        Standard Transfer
      </h2>

      <div className="space-y-5">
        {error && (
          <div className="bg-red-500/10 rounded-lg p-4 text-sm text-red-400">
            {error}
          </div>
        )}

        <Input
          label="Recipient Address"
          name="recipientAddress"
          placeholder="0x..."
          value={recipientAddress}
          onChange={(e) => setRecipientAddress(e.target.value)}
        />

        <Input
          label="Amount"
          name="transferAmount"
          type="number"
          placeholder="0.0"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          suffix="SDFT"
        />

        <Button
          variant="primary"
          onClick={handleTransfer}
          disabled={
            !isConnected || isTransferring || !recipientAddress || !amount
          }
          className="w-full py-3 mt-2">
          {isTransferring ? "Procesando..." : "Send Transfer"}
        </Button>

        {isConnected && (
          <Card className="p-4 text-sm mt-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Available balance:</span>
              <span className="font-medium">
                {Number(balance).toLocaleString()}{" "}
                <span className="text-green-400">SDFT</span>
              </span>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default TransferForm;
