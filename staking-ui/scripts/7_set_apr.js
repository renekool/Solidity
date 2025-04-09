const StakingPlatform = artifacts.require("StakingPlatform");

module.exports = async function (callback) {
  try {
    // Obtener la instancia del contrato desplegado
    const stakingPlatform = await StakingPlatform.deployed();

    // Obtener cuentas desde web3 (Ganache)
    const accounts = await web3.eth.getAccounts();
    const owner = accounts[0]; // Owner: quien tiene permiso para setear el APR
    const alice = accounts[1]; // Por ejemplo, usaremos a Alice para comprobar recompensas

    // Definir el nuevo APR en basis points.
    // Ejemplo: 3500 equivale a 35.00% anual.
    const newAPR = 3550;
    console.log(`⏳ Actualizando APR a ${newAPR / 100}%...`);

    // Llamar a la función setAPR desde la cuenta owner
    await stakingPlatform.setAPR(newAPR, { from: owner });

    // Consultar el nuevo APR directamente desde el contrato
    const updatedAPR = await stakingPlatform.apr();
    console.log(
      `✅ Nuevo APR establecido: ${updatedAPR} basis points (${
        updatedAPR / 100
      }%)`
    );

    // Opcional: Simular avance de tiempo (por ejemplo, 3600 segundos = 1 hora)
    console.log("⏳ Avanzando 3600 segundos en Ganache...");
    await web3.currentProvider.send(
      { method: "evm_increaseTime", params: [3600], id: 0 },
      () => {}
    );
    await web3.currentProvider.send({ method: "evm_mine", id: 1 }, () => {});

    // Consultar las recompensas acumuladas para Alice con el nuevo APR
    console.log("📊 Calculando recompensas para Alice con el nuevo APR...");
    const rewardsAlice = await stakingPlatform.calculateRewards(alice);
    const web3RewardsAlice = web3.utils.fromWei(
      rewardsAlice.toString(),
      "ether"
    );
    console.log(`🏦 Recompensas para Alice: ${web3RewardsAlice} RWD`);

    callback();
  } catch (error) {
    console.error("❌ Error al actualizar el APR:", error);
    callback(error);
  }
};
