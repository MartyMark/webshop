/**
 * Imports
 */
const express = require('express')
const mysql = require('mysql')
const path = require('path')
const NodeCache = require('node-cache')

/**
 * Routes
 */
const shoppingCard = require(path.join(__dirname, 'routes', 'shoppingCard'));
const details = require(path.join(__dirname, 'routes', 'details'));
const register = require(path.join(__dirname, 'routes', 'register'));
const login = require(path.join(__dirname, 'routes', 'login'));
const product = require(path.join(__dirname, 'routes', 'product'));
const main = require(path.join(__dirname, 'routes', 'main'));

const app = express();

app.use(express.static('public'))
app.use(express.json())
app.use(express.urlencoded())
app.use('/favicon.ico', express.static(path.join(__dirname, 'public', 'images', 'favicon.ico')));

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug');

/**
 * Cache-Init
 */
global.shoppingBagCache = new NodeCache({ stdTTL: 100, checkperiod: 18.000 });
global.userCache = new NodeCache({ stdTTL: 100, checkperiod: 18.000 });

const PORT = process.env.PORT || 5500;

let connection = mysql.createConnection({
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

app.get('/', function (req, res) {
    main.load(req, res);
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
    login.render('login');
});

app.get('/register', (req, res) => {
    register.render('register');
});

app.get('/details', (req, res) => {
    details.load(req, res);
});

app.get('/shoppingcard', (req, res) => {
    shoppingCard.load(req, res);
})

app.get('/shoppingcard/add', (req, res) => {
    shoppingCard.add(req, res);
})

app.get('/shoppingcard/delete', (req, res) => {
    shoppingCard.deleteItem(req, res);
})

app.get('/shoppingcard/addInBag', (req, res) => {
    shoppingCard.addInBag(req, res);
})

app.get('/shoppingcard/reduceInBag', (req, res) => {
    shoppingCard.reduceInBag(req, res);
})

app.get('/shoppingcard/purchase', (req, res) => {
    shoppingCard.purchase(reg, res);
})

app.post('/register/submit', function (req, res) {
    register.submit(req, res);
});

app.post('/login/submit', (req, res) => {
    login.submit(req, res);
});

app.get('/productInfo', (req, res) => {
    product.info(req, res);
});

app.listen(PORT, () => console.log('Server started'));