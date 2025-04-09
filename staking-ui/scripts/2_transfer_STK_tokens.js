const StakingToken = artifacts.require("StakingToken");

module.exports = async function (callback) {
  try {
    // Limpiar la consola al iniciar
    console.clear();

    // Obtener cuentas desde Truffle
    const accounts = await web3.eth.getAccounts();
    const owner = accounts[0]; // Owner (cuenta principal)
    const alice = accounts[1]; // Alice (cuenta 1 de Ganache)
    const bob = accounts[2]; // Bob (cuenta 2 de Ganache)

    // Obtener la instancia del contrato StakingToken
    const stakingToken = await StakingToken.deployed();

    // Definir una sola variable para el monto a transferir (por ejemplo, 1000 STK)
    const stkAmount = web3.utils.toWei("10000", "ether");

    console.log(
      `Transfiriendo ${web3.utils.fromWei(
        stkAmount,
        "ether"
      )} STK a Alice: ${alice}`
    );
    await stakingToken.transfer(alice, stkAmount, { from: owner });

    console.log(
      `Transfiriendo ${web3.utils.fromWei(
        stkAmount,
        "ether"
      )} STK a Bob: ${bob}`
    );
    await stakingToken.transfer(bob, stkAmount, { from: owner });

    console.log("✅ Transferencias completadas.");
    callback();
  } catch (error) {
    console.error("❌ Error en la transferencia de tokens STK:", error);
    callback(error);
  }
};
