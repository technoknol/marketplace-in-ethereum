const Marketplace = artifacts.require('./Marketplace.sol')

require('chai')
    .use(require('chai-as-promised'))
    .should()

contract('Marketplace', ([deployer, seller, buyer]) => {
    let marketplace;

    before(async () => {
        marketplace = await Marketplace.deployed();
    })

    describe('deployment', async () => {
        it('deploys successfully', async () => {
            const address = await marketplace.address;
            assert.notEqual(address, 0x0);
            assert.notEqual(address, '');
            assert.notEqual(address, null);
            assert.notEqual(address, undefined);
        })

        it('has name', async () => {
            const name = await marketplace.name();
            assert.equal(name, 'Shyam Test');
        })

        it('has product count', async () => {
            const productCount = await marketplace.productCount();
            assert.equal(productCount, 0);
        })
    })

    describe('products', async () => {
        let productCount, result;
        before(async () => {
            result = await marketplace.createProduct('iPhone 13', web3.utils.toWei('1', 'Ether'), { from: seller });
            productCount = await marketplace.productCount();
            // console.log( Marketplace)
        })

        it('creates a product', async () => {
            assert.equal(productCount, 1);
            let logs = result.logs[0].args;
            // console.log(logs);
            assert.equal(logs.id.toNumber(), productCount.toNumber(), 'id is correct');
            assert.equal(logs.name, 'iPhone 13' , 'Name is correct');
            assert.equal(logs.price, web3.utils.toWei('1', 'Ether') , 'Price is correct');
            assert.equal(logs.owner, seller , 'owner is correct');
            assert.equal(logs.purchased, false , 'Purchased is correct');

            // product must have a name
            await marketplace.createProduct('', web3.utils.toWei('1', 'Ether'), { from: seller }).should.be.rejected;
            // product must have a price
            await marketplace.createProduct('iPhone 13', 0, { from: seller }).should.be.rejected;
        })

        it('lists products', async () => {
            const product = await marketplace.products(productCount);

            assert.equal(product.id.toNumber(), productCount.toNumber(), 'id is correct');
            assert.equal(product.name, 'iPhone 13' , 'Name is correct');
            assert.equal(product.price, web3.utils.toWei('1', 'Ether') , 'Price is correct');
            assert.equal(product.owner, seller , 'owner is correct');
            assert.equal(product.purchased, false , 'Purchased is correct');

        })

        it('purchases product', async () => {
            const result = await marketplace.purchaseProduct(productCount, { from: buyer, value: web3.utils.toWei('1', 'Ether')});

            const logs = result.logs[0].args;
            // console.log(logs);
            assert.equal(logs.id.toNumber(), productCount.toNumber(), 'id is correct');
            assert.equal(logs.name, 'iPhone 13' , 'Name is correct');
            assert.equal(logs.price, web3.utils.toWei('1', 'Ether') , 'Price is correct');
            assert.equal(logs.owner, buyer , 'owner is correct');
            assert.equal(logs.purchased, true , 'Purchased is correct');


        })
    })

})
