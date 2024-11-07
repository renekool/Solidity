const SimpleAuction = artifacts.require("SimpleAuction");

contract("SimpleAuction", accounts => {
    let auction;

    beforeEach(async () => {
        auction = await SimpleAuction.new();
    });

    it("1. Debería establecer al desplegante como el propietario", async () => {
        const owner = await auction.getOwner();
        assert.equal(owner, accounts[0], "El propietario debería ser el despliegue de la cuenta");
    });

    it("2. Debería inicializar highestBid a 0", async () => {
        const highestBid = await auction.highestBid.call();
        assert.equal(highestBid.toNumber(), 0, "La oferta más alta debería ser 0 al inicio");
    });

    it("3. Debería inicializar auctionEnded a false", async () => {
        const auctionEnded = await auction.auctionEnded.call();
        assert.equal(auctionEnded, false, "La subasta debería estar activa al inicio");
    });

    it("4. Debería permitir una oferta válida y actualizar highestBid y highestBidder", async () => {
        // Hacer una oferta válida desde accounts[1]
        await auction.bid({ from: accounts[1], value: web3.utils.toWei("1", "ether") });
      
        const highestBid = await auction.highestBid.call();
        const highestBidder = await auction.highestBidder.call();
      
        assert.equal(highestBid.toString(), web3.utils.toWei("1", "ether"), "La oferta más alta debería ser 1 ETH");
        assert.equal(highestBidder, accounts[1], "El ofertante más alto debería ser accounts[1]");
    });
      
    it("5. Debería rechazar ofertas menores que la oferta más alta", async () => {
        // Hacer una oferta inicial
        await auction.bid({ from: accounts[1], value: web3.utils.toWei("1", "ether") });
      
        try {
            // Hacer una oferta menor desde otra cuenta
            await auction.bid({ from: accounts[2], value: web3.utils.toWei("10", "ether") });
            assert.fail("Debería haber fallado ya que la oferta es menor a la oferta actual más alta");
        } catch (error) {
            assert(error.message.includes("Hay una oferta más alta"), "Debería lanzar un error indicando que la oferta no es suficiente");
        }
    });
});