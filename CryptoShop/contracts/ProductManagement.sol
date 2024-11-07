// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

/**
 * @title ProductManagement
 * @dev Contrato abstracto para manejar productos en la tienda
 */

 abstract contract ProductManagement {
    // Enum para representar la categoria del producto
    enum Category { Electronics, Clothing, Books, Food, Others }

    // Estructura para representar un producto
    struct Product {
        uint256 id;
        string name;
        uint256 price; // Precio en tokens STK
        uint256 stock;        
        Category category;
    }

    uint256 internal nextProductId;
    mapping (uint256 => Product) internal products;

    event ProductAdded(uint256 indexed id, string name, uint256 price, uint256 stock, Category category);
    event ProductUpdated(uint256 indexed id, string name, uint256 price, uint256 stock, Category category);

    /**
     * @dev Función interna para agregar un nuevo producto.
     * @param _name Nombre del producto.
     * @param _price Precio del producto en tokens STK.
     * @param _stock Cantidad disponible en inventario.
     * @param _category Categoría del producto.
     */
    function _addProduct(string memory _name, uint256 _price, uint256 _stock, Category _category) internal {
        require(_price > 0, "ProductManagement: el precio debe ser mayor a 0");
        require(_stock > 0, "ProductManagement: el stock debe ser mayor a 0");

        products[nextProductId] = Product(nextProductId, _name, _price, _stock, _category);
        emit ProductAdded(nextProductId, _name, _price, _stock, _category);
        nextProductId++;
    }

    /**
     * @dev Función interna para actualizar un producto existente.
     * @param _productId ID del producto a actualizar.
     * @param _name Nuevo nombre del producto.
     * @param _price Nuevo precio del producto.
     * @param _stock Nuevo stock del producto.
     * @param _category Nueva categoría del producto.
     */
    function _updateProduct(uint256 _productId, string memory _name, uint256 _price, uint256 _stock, Category _category) internal {
        require(_price > 0, "ProductManagement: el precio debe ser mayor a 0");
        require(_stock >= 0, "ProductManagement: el stock no puede ser negativo");                

        Product storage product = products[_productId];
        product.name = _name;
        product.price = _price;
        product.stock = _stock;
        product.category = _category;
        
        // Actualizar el precio de los productos con el precio actualizado
        emit ProductUpdated(_productId, _name, _price, _stock, _category);
    }

    /**
     * @dev Función pública para obtener información de un producto.
     * @param _productId ID del producto a consultar.
     * @return product by id
     */
    function getProduct(uint256 _productId) public view returns (Product memory) {
        return products[_productId];
    }
 }