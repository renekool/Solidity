const SimpleDeFiToken = artifacts.require("SimpleDeFiToken");

module.exports = async function (deployer, network, accounts) {
  // ✅ Obtener la dirección del propietario desde las cuentas
  const owner = accounts[0];

  console.log("🚀 Iniciando despliegue de SimpleDeFiToken...");

  // ✅ Desplegar el token SimpleDeFiToken
  await deployer.deploy(SimpleDeFiToken, { from: owner });
  const simpleDeFiToken = await SimpleDeFiToken.deployed();

  // ✅ Obtener el suministro total para mostrar en los logs
  const totalSupply = await simpleDeFiToken.totalSupply();
  const totalSupplyEth = web3.utils.fromWei(totalSupply, "ether");

  console.log("✅ SimpleDeFiToken desplegado en:", simpleDeFiToken.address);
  console.log("💰 Suministro total inicial:", totalSupplyEth, "SDFT");
  console.log("👑 Owner del token:", owner);
  console.log("✨ Despliegue completado con éxito!");
};
