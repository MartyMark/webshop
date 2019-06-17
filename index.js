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

app.get('/', function (req, res) {
    const sectionTitle = 'SECTION_TITLE_TEXT_42';

    let sql = "SELECT * FROM product"

    let count = calculateCount(req)
    let totalAmount = calculateTotalAmount(req)

    connection.query(sql, function (err, result) {
        if (err) throw err;

        res.render('index', { sectionTitle: sectionTitle, products: result, count: count, totalAmount: totalAmount })
    });
});

app.get('/index/:username', function (req, res) {
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
        imagePath: 'images/item-1.png',
        price: '10,00',
        description: {
            rowTop: 'rowTop_1',
            rowMiddle: 'rowMiddle_1',
            rowBottom: 'rowBottom_1',
        }
    },
    {
        imagePath: 'images/item-1.png',
        price: '20,00',
        description: {
            rowTop: 'rowTop_2',
            rowMiddle: 'rowMiddle_2',
            rowBottom: 'rowBottom_2',
        }
    },
    {
        imagePath: 'images/item-1.png',
        price: '30,00',
        description: {
            rowTop: 'rowTop_3',
            rowMiddle: 'rowMiddle_3',
            rowBottom: 'rowBottom_3',
        }
    }
    ];
    let count = calculateCount(req)
    let totalAmount = calculateTotalAmount(req)

    res.render('shoppingcard', { items: items, count: count, totalAmount: totalAmount });
})

app.get('/shoppingcard/add', (req, res) => {
    let productId = req.query.id
    let productPrice = req.query.price

    let ip = req.connection.remoteAddress

    let productList = shoppingBagCache.get(ip);
    let product = { 'id': productId, 'price': productPrice }

    if (typeof productList === 'undefined') {
        shoppingBagCache.set(ip, [product], 10000);
    } else {
        productList.push(product)
        shoppingBagCache.set(ip, productList, 10000);
    }
    let count = shoppingBagCache.get(ip).length
    let totalAmount = calculateTotalAmount(req)

    //res.render('index', { count: count, totalAmount: totalAmount })
})

app.post('/register/submit', function (req, res) {
    let sql = "INSERT INTO user (vorname, name, street, zipcode, email, password) VALUES (\"#FIRSTNAME#\",\"#LASTNAME#\",\"#STREET#\",\"#PLZ#\",\"#EMAIL#\",\"#PASSWORD#\")";

    sql.replace('#FIRSTNAME#', req.body.firstName);
    sql.replace('#LASTNAME#', req.body.lastName);
    sql.replace('#STREET#', req.body.street);
    sql.replace('#PLZ#', req.body.zipcode);
    sql.replace('#EMAIL#', req.body.email);
    sql.replace('#PASSWORD#', req.body.password);

    connection.query(sql, function (err, result) {
        if (err) throw err;
        console.log("user-record inserted");
    });
    res.redirect('/login');
});

app.post('/login/submit', (req, res) => {
    console.log(req);
    console.log(req.body);
    console.log(req.body.username);
    console.log(req.body.psw);
    var username = req.body.username;
    var password = req.body.psw;

    var sql = "SELECT * FROM user WHERE name = '" + username + "' and password = '" + password + "'";

    connection.query(sql, function (err, result) {
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

connection.connect(function (error) {
    if (!error) {
        console.log('Error');
    } else {
        console.log('Connected');
    }
});

const PORT = process.env.PORT || 5500;

app.listen(PORT, () => console.log('Server started'));

function calculateTotalAmount(req) {
    let ip = req.connection.remoteAddress
    let productList = shoppingBagCache.get(ip)
    let totalAmount = 0;

    if (typeof productList !== 'undefined') {
        productList.forEach(element => {
            totalAmount += parseFloat(element.price)
        });
    }
    return String(Number(totalAmount).toFixed(2))
}

function calculateCount(req) {
    let ip = req.connection.remoteAddress
    let productList = shoppingBagCache.get(ip)
    let count = 0;

    if (typeof productList !== 'undefined') {
        count = productList.length
    }
    return count;
}