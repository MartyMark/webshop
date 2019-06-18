const express = require('express')
const mysql = require('mysql')
const path = require('path')
const uuidv4 = require('uuid/v4')
const NodeCache = require("node-cache")

const app = express();

app.use(express.static('public'))
app.use(express.json())
app.use(express.urlencoded())

app.set('views', path.join(__dirname, 'public/views'))
app.set('view engine', 'pug');

const shoppingBagCache = new NodeCache({ stdTTL: 100, checkperiod: 18.000 });

app.get('/', function(req, res) {
    const sectionTitle = 'SECTION_TITLE_TEXT_42';

    let sql = "SELECT * FROM product"

    let ip = req.connection.remoteAddress
    let productList = shoppingBagCache.get(ip)

    let count = calculateCount(productList)
    let totalAmount = calculateTotalAmount(productList)

    connection.query(sql, function(err, result) {
        if (err) throw err;

        res.render('index', { sectionTitle: sectionTitle, products: result, count: count, totalAmount: totalAmount })
    });
});

app.get('/index/:username', function(req, res) {
    var username = req.params.username;
    //res.render('index', { name: username }, function(err, html) {
    //html.getElementById('loginText').value = username;
    //});
    //res.render('index', { output: req.params.username });
    res.redirect('/');
});

app.get('/login', (reg, res) => {
    res.render('login');
});

app.get('/register', (req, res) => {
    res.render('register');
});

app.get('/details', (req, res) => {
    res.render('details');
});

app.get('/shoppingcard', (req, res) => {
    let items = [{
            image_path: 'images/item-1.png',
            price: '10,00',
            description: {
                rowTop: 'rowTop_1',
                rowMiddle: 'rowMiddle_1',
                rowBottom: 'rowBottom_1',
            }
        },
        {
            image_path: 'images/item-1.png',
            price: '20,00',
            description: {
                rowTop: 'rowTop_2',
                rowMiddle: 'rowMiddle_2',
                rowBottom: 'rowBottom_2',
            }
        },
        {
            image_path: 'images/item-1.png',
            price: '30,00',
            description: {
                rowTop: 'rowTop_3',
                rowMiddle: 'rowMiddle_3',
                rowBottom: 'rowBottom_3',
            }
        }
    ];

    let ip = req.connection.remoteAddress
    let productList = shoppingBagCache.get(ip)

    let groupedProducts = groupProductsByID(productList)

    let count = calculateCount(productList)
    let totalAmount = calculateTotalAmount(productList)
    let title = 'Warenkorb'

    if (groupedProducts.length == 0) {
        title = 'Ihr Warenkorb ist leer.'
    }
    res.render('shoppingcard', { title: title, products: groupedProducts, count: count, totalAmount: totalAmount });
})

app.get('/shoppingcard/add', (req, res) => {
    const sectionTitle = 'SECTION_TITLE_TEXT_42';
    let productId = req.query.id
    let productPrice = req.query.price

    let ip = req.connection.remoteAddress

    let productList = shoppingBagCache.get(ip);

    let product = { 'id': productId, 'price': productPrice }

    if (typeof productList === 'undefined') {
        shoppingBagCache.set(ip, [product]);
    } else {
        productList.push(product)
        shoppingBagCache.set(ip, productList);
    }
    let count = shoppingBagCache.get(ip).length
    let totalAmount = calculateTotalAmount(shoppingBagCache.get(ip))

    let sql = "SELECT * FROM product"

    connection.query(sql, function(err, result) {
        if (err) throw err;

        res.render('index', { sectionTitle: sectionTitle, products: result, count: count, totalAmount: totalAmount })
    });
})

app.get('/shoppingcard/delete', (req, res) => {
    let productID = req.query.id
    let ip = req.connection.remoteAddress
    let productList = shoppingBagCache.get(ip);
    let filtertProducts = filterProdcutsByID(productList, productID)

    shoppingBagCache.set(ip, filtertProducts);
    let groupedProducts = groupProductsByID(filtertProducts)
    let count = calculateCount(productList)
    let totalAmount = calculateTotalAmount(productList)
    let title = 'Warenkorb'

    if (count == 0) {
        title = 'Ihr Warenkorb ist leer.'
    }
    res.render('shoppingcard', { title: title, products: groupedProducts, count: count, totalAmount: totalAmount });
})

app.get('/shoppingcard/addInBag', (req, res) => {
    let productID = req.query.id
    let originalProductPrice = req.query.originalPrice
    let ip = req.connection.remoteAddress

    let productList = shoppingBagCache.get(ip);
    productList.push({ 'id': productID, 'price': originalProductPrice })
    shoppingBagCache.set(ip, productList);


    let groupedProducts = groupProductsByID(productList)
    let totalAmount = calculateTotalAmount(productList)
    let count = calculateCount(productList)

    res.render('shoppingcard', { title: 'Warenkorb', products: groupedProducts, count: count, totalAmount: totalAmount });
})

app.get('/shoppingcard/reduceInBag', (req, res) => {
    let productID = req.query.id
    let originalProductPrice = req.query.originalPrice
    let ip = req.connection.remoteAddress

    let productList = shoppingBagCache.get(ip);
    for (let i = 0; i < productList.length; i++) {
        let element = productList[i]
        if (element.id === productID) {
            productList.splice(i, 1)
            break
        }
    }
    shoppingBagCache.set(ip, productList);

    let groupedProducts = groupProductsByID(productList)

    let totalAmount = calculateTotalAmount(productList)
    let count = calculateCount(productList)

    let title = 'Warenkorb'
    if (groupedProducts.length == 0) {
        title = 'Ihr Warenkorb ist leer.'
    }
    res.render('shoppingcard', { title: title, products: groupedProducts, count: count, totalAmount: totalAmount });
})

app.post('/register/submit', function(req, res) {
    let sql = "INSERT INTO user (vorname, name, street, zipcode, email, password) VALUES (\"#FIRSTNAME#\",\"#LASTNAME#\",\"#STREET#\",\"#PLZ#\",\"#EMAIL#\",\"#PASSWORD#\")";

    sql.replace('#FIRSTNAME#', req.body.firstName);
    sql.replace('#LASTNAME#', req.body.lastName);
    sql.replace('#STREET#', req.body.street);
    sql.replace('#PLZ#', req.body.zipcode);
    sql.replace('#EMAIL#', req.body.email);
    sql.replace('#PASSWORD#', req.body.password);

    connection.query(sql, function(err, result) {
        if (err) throw err;
    });
    res.redirect('/login');
});

app.post('/login/submit', (req, res) => {
    var username = req.body.username;
    var password = req.body.psw;

    var sql = "SELECT * FROM user WHERE name = '" + username + "' and password = '" + password + "'";

    connection.query(sql, function(err, result) {
        if (err) throw err;

        if (!result.length) {
            res.redirect('/login');
            return;
        }
        res.redirect('/index/' + username);
    });
});

var connection = mysql.createConnection({
    //Properties
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'sampledb'
});

connection.connect(function(error) {
    if (!error) {
        console.log('Error');
    } else {
        console.log('Connected');
    }
});

const PORT = process.env.PORT || 5500;

app.listen(PORT, () => console.log('Server started'));

function calculateTotalAmount(productList) {
    let totalAmount = 0;

    if (typeof productList !== 'undefined') {
        productList.forEach(element => {
            totalAmount += parseFloat(element.price)
        });
    }
    return String(Number(totalAmount).toFixed(2))
}

function calculateCount(productList) {
    let count = 0;

    if (typeof productList !== 'undefined') {
        count = productList.length
    }
    return count;
}

function groupProductsByID(products) {
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
                    'originalPrice': element.price
                }
                groupedProducts.push(obj)
            }
        });
    }
    return groupedProducts;
}

function filterProdcutsByID(productList, productID) {
    productList.forEach((element, index) => {
        if (element.id == productID) {
            productList.splice(index, 1)
            return filterProdcutsByID(productList, productID)
        }
    });
    return productList;
}