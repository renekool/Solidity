const StakingToken = artifacts.require("StakingToken");
const RewardToken = artifacts.require("RewardToken");
const StakingPlatform = artifacts.require("StakingPlatform");

module.exports = async function (deployer, network, accounts) {
  const owner = accounts[0]; // Asegurar que el owner sea explícito
  const initialSupply = web3.utils.toWei("100000000", "ether"); // Suministro inicial

  // ✅ Desplegar StakingToken con el mismo suministro inicial
  await deployer.deploy(StakingToken, initialSupply, { from: owner });
  const stakingToken = await StakingToken.deployed();

  // ✅ Desplegar RewardToken con el mismo suministro inicial
  await deployer.deploy(RewardToken, initialSupply, { from: owner });
  const rewardToken = await RewardToken.deployed();

  // Definir el APR inicial (por ejemplo, 1250 equivale a 12.50% anual)
  const initialAPR = 1250;

  // ✅ Desplegar StakingPlatform con las direcciones de los tokens
  await deployer.deploy(
    StakingPlatform,
    stakingToken.address,
    rewardToken.address,
    initialAPR,
    { from: owner }
  );

  const stakingPlatform = await StakingPlatform.deployed();

  // ✅ Transferir la propiedad de los tokens al StakingPlatform
  await stakingToken.transferOwnership(stakingPlatform.address, {
    from: owner,
  });
  await rewardToken.transferOwnership(stakingPlatform.address, { from: owner });

  console.log("✅ StakingToken desplegado en:", stakingToken.address);
  console.log("✅ RewardToken desplegado en:", rewardToken.address);
  console.log("✅ StakingPlatform desplegado en:", stakingPlatform.address);
  console.log("👑 Owner del despliegue:", owner);
};
