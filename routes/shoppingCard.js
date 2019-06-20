module.exports.purchase = function (req, res) {
    let ip = req.connection.remoteAddress
    let productList = global.shoppingBagCache.get(ip);
    let groupedProducts = _groupProductsByID(productList)

    let userId = global.userCache.get(ip);

    _updateDB(groupedProducts, userId)
    global.shoppingBagCache.set(ip, []);
    res.redirect('/');
}

module.exports.load = function (req, res) {
    let items = [{
        image_path: 'images/item-1.png',
        price: '10,00',
        description: {
            rowTop: 'rowTop_1',
            rowMiddle: 'rowMiddle_1',
            rowBottom: 'rowBottom_1',
        }
    }, {
        image_path: 'images/item-1.png',
        price: '20,00',
        description: {
            rowTop: 'rowTop_2',
            rowMiddle: 'rowMiddle_2',
            rowBottom: 'rowBottom_2',
        }
    }, {
        image_path: 'images/item-1.png',
        price: '30,00',
        description: {
            rowTop: 'rowTop_3',
            rowMiddle: 'rowMiddle_3',
            rowBottom: 'rowBottom_3',
        }
    }];

    let ip = req.connection.remoteAddress
    let productList = global.shoppingBagCache.get(ip)

    let groupedProducts = _groupProductsByID(productList)

    let count = calculateTotalProductCount(productList)
    let totalAmount = calculateTotalAmount(productList)
    let title = productCount === 0 ? 'Ihr Warenkorb ist leer.' : 'Warenkorb';

    res.render('shoppingcard', { title: title, products: groupedProducts, count: count, totalAmount: totalAmount });
}

module.exports.add = function (req, res) {
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

module.exports.deleteItem = function (req, res) {
    let productID = req.query.id,
        ip = req.connection.remoteAddress,
        productList = global.shoppingBagCache.get(ip),
        filtertProducts = _filterProdcutsByID(productList, productID)

    global.shoppingBagCache.set(ip, filtertProducts);
    res.redirect('/');
}

module.exports.addInBag = function (req, res) {
    let productID = req.query.id,
        originalProductPrice = req.query.originalPrice,
        ip = req.connection.remoteAddress,
        productList = global.shoppingBagCache.get(ip);

    productList.push({ 'id': productID, 'price': originalProductPrice })
    global.shoppingBagCache.set(ip, productList);
    res.redirect('/');
}

module.exports.reduceInBag = function (req, res) {
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
            return filterProdcutsByID(productList, productID)
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
            console.log(addBuyedProduct)
            console.log(userId)
            _update(addBuyedProduct)
        }
        _update(setStock)
    }
}

function _update(sql) {
    connection.query(sql, function (err, result) {
        if (err) throw err;

        console.log(result)
    });
}