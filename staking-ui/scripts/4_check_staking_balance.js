const StakingToken = artifacts.require("StakingToken");

module.exports = async function (callback) {
  try {
    // Obtener cuentas desde Truffle
    const accounts = await web3.eth.getAccounts();
    const owner = accounts[0]; // Owner (cuenta principal)
    const alice = accounts[1]; // Alice (cuenta 1 de Ganache)
    const bob = accounts[2]; // Alice (cuenta 1 de Ganache)

    // Instancia del contrato StakingToken
    const stakingToken = await StakingToken.deployed();

    // Verificar el saldo del contrato (su propia dirección)
    const contractBalance = await stakingToken.balanceOf(stakingToken.address);
    console.log(
      `🏦 StakingPlatform (${stakingToken.address}): ${web3.utils.fromWei(
        contractBalance.toString(),
        "ether"
      )} STK`
    );

    // Verificar saldo del owner
    const ownerBalance = await stakingToken.balanceOf(owner);
    console.log(
      `👑 Owner (${owner}): ${web3.utils.fromWei(ownerBalance, "ether")} STK`
    );

    // Verificar saldo de Alice
    const aliceBalance = await stakingToken.balanceOf(alice);
    console.log(
      `👩 Alice (${alice}): ${web3.utils.fromWei(aliceBalance, "ether")} STK`
    );

    // Verificar saldo de Bob
    const bobBalance = await stakingToken.balanceOf(bob);
    console.log(
      `👩 Bob (${bob}): ${web3.utils.fromWei(bobBalance, "ether")} STK`
    );

    callback();
  } catch (error) {
    console.error("❌ Error al verificar los saldos:", error);
    callback(error);
  }
};
