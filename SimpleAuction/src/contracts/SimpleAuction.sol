// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

/*
    PROBLEMA: Crear un contrato de subasta donde:

    01 • Los usuarios puedan hacer ofertas (bids) enviando Ether.
    02 • Solo el propietario pueda finalizar la subasta.
    03 • El contrato registre eventos cuando se hagan ofertas y cuando la subasta termine.
    04 • Solo se acepte una oferta si es mayor que la oferta actual más alta.
    05 • Cuando se finaliza la subasta, los fondos se transferirán al propietario.
*/

contract SimpleAuction {
    address private owner;
    uint public highestBid;
    address public highestBidder;
    bool public auctionEnded;

    event HighestBidIncreased(address indexed bidder, uint amount);
    event AuctionEnded(address winner, uint amount);
    event AuctionReset();

    // Errores personalizados
    error Unauthorized();
    error AuctionAlreadyEnded();
    error BidNotHighEnough(uint currentBid);
    error NoFundsToWithdraw();

    modifier onlyOwner() {
        if (msg.sender != owner) {
            revert Unauthorized(); // Error personalizado si no es el propietario
        }
        _;
    }

    modifier auctionActive() {
        if (auctionEnded) {
            revert AuctionAlreadyEnded(); // Error personalizado si la subasta ha terminado
        }
        _;
    }

    constructor() {
        owner = msg.sender;
        auctionEnded = false;
    }

    function getOwner() public view returns (address) {
        return owner;
    }

    // Función para realizar ofertas
    function bid() public payable auctionActive {
        if (msg.value <= 0) {
            revert NoFundsToWithdraw(); // Error personalizado si la oferta es cero o menor
        }
        if (msg.value <= highestBid) {
            revert BidNotHighEnough(highestBid); // Error personalizado si la oferta no es suficiente
        }

        if (highestBid != 0) {
            // Devolver el Ether al ofertante anterior
            payable(highestBidder).transfer(highestBid);
        }

        highestBid = msg.value;
        highestBidder = msg.sender;
        emit HighestBidIncreased(msg.sender, msg.value);
    }

    // Función para finalizar la subasta
    function endAuction() public onlyOwner auctionActive {
        auctionEnded = true;
        emit AuctionEnded(highestBidder, highestBid);

        // Transferir los fondos al propietario
        payable(owner).transfer(highestBid);
    }

    // Nueva función para reiniciar la subasta
    function resetAuction() public onlyOwner {
        // Si la subasta no ha terminado y hay una oferta, devolver el Ether al ofertante más alto
        if (!auctionEnded && highestBid != 0) {
            payable(highestBidder).transfer(highestBid);
        }

        // Reiniciar el estado de la subasta
        highestBid = 0;
        highestBidder = address(0);
        auctionEnded = false;

        emit AuctionReset();
    }    
}