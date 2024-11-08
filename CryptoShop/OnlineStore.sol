// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

// Importamos contratos y archivos necesarios
import "@openzeppelin/contracts@4.5.0/access/Ownable.sol";
import "@openzeppelin/contracts@4.5.0/security/ReentrancyGuard.sol";
import "./MyToken.sol";
import "./ProductManagement.sol";

contract OnlineStore is Ownable, ReentrancyGuard, ProductManagement {

    MyToken public myToken;
    uint256 public tokenPrice; // Precio de 1 token en Wei (Ether)

    event TokensPurchased(address indexed buyer, uint256 amount);
    event ProductPurchased(address indexed buyer, uint256 indexed productId, uint256 quantity);

    constructor(MyToken _myToken, uint256  _tokenPrice) {
        require(address(_myToken) != address(0), "OnlineStore: Direccion del token invalida");
        require(_tokenPrice > 0, "OnlineStore: El precio del token debe ser mayor a 0");

        myToken = _myToken; // Asignamos el token
        tokenPrice = _tokenPrice; // Asignamos el precio del token
    }

    /**
     * @dev Función para que los clientes compren tokens enviando Ether.
     * La función es 'payable' para recibir Ether.
     */
    function buyTokens() external payable nonReentrant {
        require(msg.value > 0, "OnlineStore: Debes enviar Ether para comprar tokens");

        uint256 amountToBuy = _calculateTokenAmount(msg.value);
        require(amountToBuy > 0, "OnlineStore: La cantidad de tokens a comprar es cero");

        bool sent = myToken.transfer(msg.sender, amountToBuy);
        require(sent, "OnlineStore: Transferencia de tokens fallida");

        emit TokensPurchased(msg.sender, amountToBuy);
    }

    /**
     * @dev Función interna 'pure' para calcular la cantidad de tokens a comprar.
     * @param weiAmount Cantidad de Ether enviada en Wei.
     * @return amountToBuy Cantidad de tokens a entregar.
     */
    function _calculateTokenAmount(uint256 weiAmount) internal view returns (uint256) {
        return (weiAmount * 10 ** myToken.decimals()) / tokenPrice;
    }

    /**
     * @dev Función pública para que el propietario agregue nuevos productos a la tienda.
     * @param _name Nombre del producto.
     * @param _price Precio del producto en tokens STK.
     * @param _stock Cantidad disponible en inventario.
     * @param _category Categoría del producto.
     */
    function addProduct(string memory _name, uint256 _price, uint256 _stock, Category _category) external onlyOwner {
        _addProduct(_name, _price, _stock, _category);
    }

    /**
     * @dev Función pública para actualizar un producto existente.
     * @param _productId ID del producto a actualizar.
     * @param _name Nuevo nombre del producto.
     * @param _price Nuevo precio del producto.
     * @param _stock Nuevo stock del producto.
     * @param _category Nueva categoría del producto.
     */
    function updateProduct(uint256 _productId, string memory _name, uint256 _price, uint256 _stock, Category _category) external onlyOwner {
        _updateProduct(_productId, _name, _price, _stock, _category);
    }

    /**
     * @dev Función para comprar un producto utilizando tokens STK.
     * @param _productId ID del producto a comprar.
     * @param _quantity Cantidad del producto a comprar.
     */
    function buyProduct(uint256 _productId, uint256 _quantity) external nonReentrant {
        require(_quantity > 0, "OnlineStore: El precio del producto no puede ser cero");

        Product storage product = products[_productId];
        require(product.stock >= _quantity, "OnlineStore: Stock insuficiente");

        uint256 totalPrice = product.price * _quantity;

        // Verificar que el contrato tiene suficiente allowance
        require(myToken.allowance(msg.sender, address(this)) >= totalPrice, "OnlineStore: Allowance insuficiente");        

        // Validar que el comprador tenga los tokens STK suficientes para poder comprar el producto
        require(myToken.balanceOf(msg.sender) >= totalPrice, "OnlineStore: Balance de tokens insuficiente");

        // Transferir tokens del comprador a la tienda
        bool success = myToken.transferFrom(msg.sender, address(this), totalPrice);
        require(success, "OnlineStore: Transferencia de tokens fallida");

        product.stock -= _quantity;

        emit ProductPurchased(msg.sender, _productId, _quantity);
    }

    /**
     * @dev Función para que el propietario retire los Ether recaudados por venta de tokens.
     */
    function withdrawFunds() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "OnlineStore: no hay fondos para retirar");

        (bool sent, ) = payable(owner()).call{value: balance}("");
        require(sent, "OnlineStore: Transferencia de Ether fallida");
    }

    /**
     * @dev Función para que el propietario retire los tokens acumulados por venta de productos.
     */
    function withdrawTokens() external onlyOwner {
        uint256 tokenBalance = myToken.balanceOf(address(this));
        require(tokenBalance > 0, "OnlineStore: No hay tokens para retirar");

        bool sent = myToken.transfer(owner(), tokenBalance);
        require(sent, "OnlineStore: Transferencia de tokens fallida");
    }

    /**
     * @dev Función 'view' para obtener el balance de tokens de la tienda.
     * @return tokenBalance Balance de tokens STK de la tienda.
     */
    function getStoreTokenBalance() external view returns (uint256) {
        return myToken.balanceOf(address(this));
    }

    /**
     * @dev Función 'pure' para convertir Wei a Ether.
     * @param weiAmount Cantidad en Wei.
     * @return etherAmount Cantidad en Ether.
     */
    function weiToEther(uint256 weiAmount) external pure returns (uint256) {
        return weiAmount / 1 ether;
    }         
}