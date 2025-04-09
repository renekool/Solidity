const RewardToken = artifacts.require("RewardToken");
const StakingPlatform = artifacts.require("StakingPlatform");

module.exports = async function (callback) {
  try {
    // Limpiar la consola al iniciar
    console.clear();

    // Definir el monto a transferir (en tokens, antes de convertir a Wei)
    const tokensToTransfer = "500000"; // Ejemplo: "450000" o "500000"

    // Obtener cuentas desde Truffle
    const accounts = await web3.eth.getAccounts();
    const owner = accounts[0]; // Owner dinámico (cuenta 0 de Ganache)

    // Obtener la instancia del contrato StakingPlatform
    const stakingPlatform = (await StakingPlatform.deployed()).address;

    // Obtener la instancia del contrato RewardToken
    const rewardToken = await RewardToken.deployed();

    // Convertir el monto de tokens a Wei
    const tokensToTransferWei = web3.utils.toWei(tokensToTransfer, "ether");

    // Mostrar información formateada en consola con emojis
    console.log("--------------------------------------------------");
    console.log("🚀 INICIANDO TRANSFERENCIA DE TOKENS");
    console.log("--------------------------------------------------");
    console.log(`👤 Owner: ${owner}`);
    console.log(`🏦 Contrato Staking: ${stakingPlatform}`);
    console.log(`💰 Tokens a Transferir: ${tokensToTransfer} RWD`);
    console.log(`🔢 Tokens en Wei: ${tokensToTransferWei}`);
    console.log("--------------------------------------------------");

    // Realizar la transferencia de tokens RWD al contrato StakingPlatform
    console.log(
      `⏳ Transfiriendo ${tokensToTransfer} RWD al contrato StakingPlatform (${stakingPlatform}) desde el owner (${owner})...`
    );
    await rewardToken.transfer(stakingPlatform, tokensToTransferWei, {
      from: owner,
    });

    console.log("✅ Transferencia completada.");
    callback();
  } catch (error) {
    console.error("❌ Error en la transferencia de tokens RWD:", error);
    callback(error);
  }
};
