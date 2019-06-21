const utility = require(require('path').join(__dirname + '/../public/script/utility'));

/**
 * 
 */
module.exports.purchase = function(req, res) {
    let ip = req.connection.remoteAddress
    let productList = global.shoppingBagCache.get(ip);
    let groupedProducts = _groupProductsByID(productList)

    let userId = global.userCache.get(ip);

    _updateDB(groupedProducts, userId)
    global.shoppingBagCache.set(ip, []);
    res.redirect('/');
}

/**
 * Ladet den Warenkorb
 */
module.exports.load = function(req, res) {
    let products = [{
            id: 1,
            name: '11GB MSI GeForce',
            description: '11GB MSI GeForce RTX 2080 Ti VENTUS 11G Aktiv PCIe 3.0 x16',
            price: 199,
            image_path: 'images/graka.jpg',
            stock: 3
        },
        {
            id: 2,
            name: 'Dell 210-AGTR',
            description: 'Dell 210-AGTR 68,6 cm (27 Zoll) UP2716D',
            price: 199,
            image_path: 'images/monitor.jpg',
            stock: 0
        },
        {
            id: 3,
            name: 'Asus ROG Maximus',
            description: 'Asus ROG Maximus XI Hero Gaming',
            price: 199,
            image_path: 'images/mainboard.jpg',
            stock: 23
        },
        {
            id: 4,
            name: 'Intel® Core i9',
            description: 'Intel® Core i9-9900K 8X 3.6GHz Boxed',
            price: 199,
            image_path: 'images/i9.jpg',
            stock: 23
        }
    ]

    let ip = req.connection.remoteAddress
    let productList = global.shoppingBagCache.get(ip)

    let groupedProducts = _groupProductsByID(productList)

    let count = utility.calculateTotalProductCount(productList)
    let totalAmount = utility.calculateTotalAmount(productList)
    let title = count === 0 ? 'Ihr Warenkorb ist leer.' : 'Warenkorb';

    res.render('shoppingcard', { title: title, products: groupedProducts, count: count, totalAmount: totalAmount });
}

module.exports.add = function(req, res) {
    let productId = req.query.id,
        productPrice = req.query.price,
        productStock = req.query.stock,
        productName = req.query.name,
        ip = req.connection.remoteAddress,
        productList = global.shoppingBagCache.get(ip),
        product = { 'id': productId, 'price': productPrice, 'stock': productStock, 'name': productName }

    if (typeof productList === 'undefined') {
        global.shoppingBagCache.set(ip, [product]);
    } else {
        productList.push(product)
        global.shoppingBagCache.set(ip, productList);
    }
    res.redirect('/');
}

module.exports.deleteItem = function(req, res) {
    let productID = req.query.id,
        ip = req.connection.remoteAddress,
        productList = global.shoppingBagCache.get(ip),
        filtertProducts = _filterProdcutsByID(productList, productID)

    global.shoppingBagCache.set(ip, filtertProducts);
    res.redirect('/shoppingcard');
}

module.exports.addInBag = function(req, res) {
    let productID = req.query.id,
        originalProductPrice = req.query.originalPrice,
        stock = req.query.stock,
        name = req.query.name,
        ip = req.connection.remoteAddress,
        productList = global.shoppingBagCache.get(ip);

    productList.push({ 'id': productID, 'price': originalProductPrice, 'stock': stock, 'name': name })

    global.shoppingBagCache.set(ip, productList);
    res.redirect('/shoppingcard');
}

module.exports.reduceInBag = function(req, res) {
    let productID = req.query.id,
        ip = req.connection.remoteAddress,
        productList = global.shoppingBagCache.get(ip);

    for (let i = 0; i < productList.length; i++) {
        let element = productList[i]
        if (element.id === productID) {
            productList.splice(i, 1)
            break
        }
    }

    global.shoppingBagCache.set(ip, productList);
    res.redirect('/shoppingcard');
}

function _groupProductsByID(products) {
    let groupedProducts = []

    if (typeof products !== 'undefined') {
        products.forEach(element => {
            let found = false;

            for (let i = 0; i < groupedProducts.length; i++) {
                let idGroup = groupedProducts[i];

                if (idGroup.id === element.id) {
                    idGroup.count++;
                    idGroup.price = (idGroup.count * parseFloat(element.price))
                    found = true;
                    break;
                }
            }
            if (!found) {
                let obj = {
                    'id': element.id,
                    'price': element.price,
                    'count': 1,
                    'originalPrice': element.price,
                    'stock': element.stock,
                    'name': element.name
                }
                groupedProducts.push(obj)
            }
        });
    }
    return groupedProducts;
}

function _filterProdcutsByID(productList, productID) {
    productList.forEach((element, index) => {
        if (element.id == productID) {
            productList.splice(index, 1)
            return _filterProdcutsByID(productList, productID)
        }
    });
    return productList;
}

function _updateDB(groupedProducts, userId) {
    for (let i = 0; i < groupedProducts.length; i++) {
        let element = groupedProducts[i]
        let setStock = "UPDATE product SET stock = " + (Number(element.stock) - Number(element.count)) + " WHERE ID = " + element.id
        let addBuyedProduct = "INSERT INTO buyedProducts(userid, productId) VALUES (" + userId + "," + element.id + ")"

        if (typeof userId !== 'undefined' && userId !== null) {
            _update(addBuyedProduct)
        }
        _update(setStock)
    }
}

function _update(sql) {
    global.connection.query(sql, function(err, result) {
        if (err) throw err;

        console.log(result)
    });
}