/**
 * Imports
 */
const express = require('express')
const mysql = require('mysql')
const path = require('path')
const favicon = require('serve-favicon');
const NodeCache = require('node-cache')

/**
 * Routes
 */
const shoppingCard = require(path.join(__dirname, 'routes', 'shoppingCard'));
const details = require(path.join(__dirname, 'routes', 'details'));
const register = require(path.join(__dirname, 'routes', 'register'));
const login = require(path.join(__dirname, 'routes', 'login'));
const main = require(path.join(__dirname, 'routes', 'main'));
const PORT = process.env.PORT || 5500;
const app = express();

app.use(express.json())
app.use(express.urlencoded())
app.use(express.static('public'));
app.use('/images', express.static(path.join(__dirname, 'public', 'images')));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug');

let connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'sampledb'
});

connection.connect(error => {
    if (!error) {
        console.log('Error');
    } else {
        console.log('Connected');
    }
});



/**
 * Globals
 */
global.shoppingBagCache = new NodeCache({ stdTTL: 100, checkperiod: 18.000 });
global.userCache = new NodeCache({ stdTTL: 100, checkperiod: 18.000 });
global.connection = connection;

app.get('/', (req, res) => {
    main.load(req, res);
});

app.get('/index/:userid', (req, res) => {
    let userid = req.params.userid;
    main.load(req, res, userid);
});

app.get('/login', (req, res) => {
    res.render('login')
});

app.post('/login/submit', (req, res) => {
    login.submit(req, res);
});

app.get('/register', (req, res) => {
    res.render('register')
});

app.post('/register/submit', (req, res) => {
    register.submit(req, res)
})

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
    shoppingCard.purchase(req, res);
})

app.listen(PORT, () => console.log('Server started'));