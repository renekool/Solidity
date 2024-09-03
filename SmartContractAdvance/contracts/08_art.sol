// SPDX-License-Identifier: MIT

// Version
pragma solidity ^0.8.0;

import "@openzeppelin/contracts@4.4.2/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts@4.4.2/access/Ownable.sol";

contract ArtToken is ERC721, Ownable {

    // -------------------------------------------
    // Initial Statements
    // -------------------------------------------

    // Smart Contract Constructor
    constructor (string memory _name, string memory _symbol) ERC721 (_name, _symbol) {}     

    // NFT token counter
    uint256 COUNTER;

    // Princing of NFT Tokens (price of the artwork)
    uint public fee = 5 ether;

    // Data structure with the properties of the artwork
    struct Art {
        uint256 id;
        string name;
        uint256 dna;
        uint8 level;
        uint8 rarity;
    }

    // Storage structure for keeping artworks
    Art [] public artWorksList;

    // Declarate of an event
    event NewArtWork (address indexed owner, uint256 id, uint256 dna);

    // -------------------------------------------
    // Help functions
    // -------------------------------------------

    // Creation of a random (requiered for NFT token properties)
    function _createRandomNum(uint256 _mod) internal view returns (uint256) {
        bytes32 hashRandomNum = keccak256(abi.encodePacked(block.timestamp, msg.sender));
        uint256 randomNum = uint256(hashRandomNum);
        return randomNum % _mod;
    }

    // NFT Token Creation (ArtWork)
    function _createArtWork(string memory _name) internal {
        uint8 randRarity = uint8(_createRandomNum(1000));
        uint256 randDna = _createRandomNum(10**16);

        Art memory newArtWork = Art(COUNTER, _name, randDna, 1, randRarity);
        artWorksList.push(newArtWork);
        _safeMint(msg.sender, COUNTER);

        emit NewArtWork (msg.sender, COUNTER, randDna);

        COUNTER++;
    }

    // NFT Token Price Update
    function updateFee(uint256 _fee) external onlyOwner {
        fee = _fee;
    }

    // Visualize the balance of the Smart Contract (ethers)
    function infoSmartContract() public view returns (uint, address) {
        address SC_address = address(this);
        uint256 SC_money = address(this).balance / 10**18;
        return (SC_money, SC_address);        
    }

    // Obtaining all created NFT tokens (artwork)
    function getArtWorks() public view returns (Art[] memory) {
        return artWorksList;
    }

    // Obtaining a user's NFT tokens
    function getOwnerArtWork(address _owner) public view returns (Art[] memory) {
        Art[] memory ownerArtWorks = new Art[](balanceOf(_owner));

        /* initialize a counter to keep 
        track of the number of artworks 
        that belong to the user */
        uint256 counter_owner = 0;
        for (uint i = 0; i < artWorksList.length ; i++) { // loop through the original array of artworks             
            if (ownerOf(i) == _owner) { // if the owner of the current artwork is the user, add it to the array of artworks for the user                 
                ownerArtWorks[counter_owner] = artWorksList[i]; // add the artwork to the array of artworks for the user 
                counter_owner++; // increment the counter of artworks for the user 
            } 
        }         
        
        return ownerArtWorks; // return the array of artworks for the user
    }

    // -------------------------------------------
    // NFT Token Development
    // -------------------------------------------

    // NFT Token Payment
    function createRandomArtWork(string memory _name) public payable {
        require(msg.value >= fee, string(abi.encodePacked("Please pay a minimum of ", Strings.toString(fee / 1 ether), " ethers")));
        _createArtWork(_name);
    }

    // Extraction of ethers from the Smart Contract to the Owner
    function withDraw() external payable onlyOwner {
        address payable _owner = payable(owner());
        _owner.transfer(address(this).balance);
    }

    // Level Up NFT Tokens
    function levelUp(uint256 _artId) public {
        require(ownerOf(_artId) == msg.sender, "You don't have this artwork");
        Art storage art = artWorksList[_artId];
        art.level++;
    }
}