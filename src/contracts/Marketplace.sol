pragma solidity ^0.5.4;

contract Marketplace {
    string public name;
    uint public productCount = 0;

    mapping(uint => Product) public products;

    struct Product {
        uint id;
        string name;
        uint price;
        address payable owner;
        bool purchased;
    }

    event ProductCreated(uint id,
        string name,
        uint price,
        address payable owner,
        bool purchased);

    event ProductPurchased(uint id,
        string name,
        uint price,
        address payable owner,
        bool purchased);

    constructor() public {
        name = "Shyam Test";
    }

    function createProduct(string memory _name, uint _price) public {
        // product is correct
        // require name
        require(bytes(_name).length > 0);
        // require price
        require(_price > 0);
        // increment productCount
        productCount++;
        // create product
        products[productCount] = Product(productCount, _name, _price, msg.sender, false);
        // trigger event
        emit ProductCreated(productCount, _name, _price, msg.sender, false);
    }

    function purchaseProduct(uint _id) public payable {
        // fetch the product
        Product memory _product = products[_id];
        // fetch the owner
        address payable seller = _product.owner;
        // check if product is valid

        // transfer ownership
        _product.owner = msg.sender;
        // mark as purchased
        _product.purchased = true;
        // update the product
        products[_id] = _product;
        // transfer the amount to seller
        address(seller).transfer(msg.value);
        // emit an event
        emit ProductPurchased(_id, _product.name, _product.price, msg.sender, true);

    }
}
