const StakingPlatform = artifacts.require("StakingPlatform");

module.exports = async (callback) => {
  try {
    // Obtener instancia del contrato desplegado
    const stakingPlatform = await StakingPlatform.deployed();

    // Obtener cuentas desde web3 (proporcionadas por Ganache)
    const accounts = await web3.eth.getAccounts();
    const alice = accounts[1]; // Alice (cuenta 1 de Ganache)
    const bob = accounts[2]; // Bob (cuenta 2 de Ganache)

    // Avanzar el tiempo en Ganache (604800 segundos = 7 días)
    console.log("⏳ Avanzando 7 días en Ganache...");
    await web3.currentProvider.send(
      { method: "evm_increaseTime", params: [3600], id: 0 },
      () => {}
    );

    // Minar un bloque nuevo para aplicar el avance de tiempo
    await web3.currentProvider.send({ method: "evm_mine", id: 1 }, () => {});

    console.log("⏩ Tiempo avanzado 7 días en Ganache.");

    // Llamar a la función calculateRewards del contrato para Alice
    console.log("📊 Calculando recompensas para Alice...");
    const rewardsAlice = await stakingPlatform.calculateRewards(alice);
    const web3RewardsAlice = web3.utils.fromWei(
      rewardsAlice.toString(),
      "ether"
    );
    console.log(
      `🏦 Recompensas calculadas para Alice: ${web3RewardsAlice} RWD`
    );

    // Llamar a la función calculateRewards del contrato para Bob
    console.log("📊 Calculando recompensas para Bob...");
    const rewardsBob = await stakingPlatform.calculateRewards(bob);
    const web3RewardsBob = web3.utils.fromWei(rewardsBob.toString(), "ether");
    console.log(`🏦 Recompensas calculadas para Bob: ${web3RewardsBob} RWD`);

    callback();
  } catch (error) {
    console.error("❌ Error al calcular las recompensas:", error);
    callback(error);
  }
};
