const RewardToken = artifacts.require("RewardToken");
const StakingPlatform = artifacts.require("StakingPlatform");

module.exports = async function (callback) {
  try {
    // Obtener cuentas desde Truffle
    const accounts = await web3.eth.getAccounts();
    const owner = accounts[0]; // Dirección del owner
    const alice = accounts[1]; // Alice (cuenta 1 de Ganache)
    const bob = accounts[2]; // Bob (cuenta 2 de Ganache)

    // Instancia del contrato RewardToken
    const rewardToken = await RewardToken.deployed();

    // Instancia del contrato StakingPlatform
    const stakingPlatform = await StakingPlatform.deployed();

    // Verificar saldo del contrato StakingPlatform
    const stakingBalance = await rewardToken.balanceOf(stakingPlatform.address);
    console.log(
      `🏦 StakingPlatform (${stakingPlatform.address}): ${web3.utils.fromWei(
        stakingBalance,
        "ether"
      )} RWD`
    );

    // Verificar saldo del owner
    const ownerBalance = await rewardToken.balanceOf(owner);
    console.log(
      `👑 Owner (${owner}): ${web3.utils.fromWei(ownerBalance, "ether")} RWD`
    );

    // Verificar saldo de Alice
    const aliceBalance = await rewardToken.balanceOf(alice);
    console.log(
      `👩 Alice (${alice}): ${web3.utils.fromWei(aliceBalance, "ether")} RWD`
    );

    // Verificar saldo de Bob
    const bobBalance = await rewardToken.balanceOf(bob);
    console.log(
      `👩 Bob (${bob}): ${web3.utils.fromWei(bobBalance, "ether")} RWD`
    );

    callback();
  } catch (error) {
    console.error("❌ Error al verificar los saldos:", error);
    callback(error);
  }
};
