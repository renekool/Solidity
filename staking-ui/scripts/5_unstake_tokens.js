const StakingPlatform = artifacts.require("StakingPlatform");
const RewardToken = artifacts.require("RewardToken");

module.exports = async function (callback) {
  try {
    // Obtener cuentas desde Truffle
    const accounts = await web3.eth.getAccounts();
    const alice = accounts[1]; // Alice (cuenta 1 de Ganache)

    // Obtener instancias de los contratos
    const stakingPlatform = await StakingPlatform.deployed();
    const rewardToken = await RewardToken.deployed();

    // Verificar balance de RWD antes del unstake
    let balanceBefore = await rewardToken.balanceOf(alice);
    console.log(
      `🔍 Balance de RWD de Alice antes del unstake: ${web3.utils.fromWei(
        balanceBefore,
        "ether"
      )} RWD`
    );

    // Realizar unstake
    console.log("🔄 Realizando unstake para Alice...");
    await stakingPlatform.unStake({ from: alice });
    console.log("✅ Unstake realizado para Alice.");

    // Verificar balance de RWD después del unstake
    let balanceAfter = await rewardToken.balanceOf(alice);
    console.log(
      `🔍 Balance de RWD de Alice después del unstake: ${web3.utils.fromWei(
        balanceAfter,
        "ether"
      )} RWD`
    );

    callback();
  } catch (error) {
    console.error("❌ Error al realizar unstake:", error);
    callback(error);
  }
};
