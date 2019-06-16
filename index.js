const express = require('express');
const mysql = require('mysql');
const path = require('path');

const app = express();

app.use(express.static('public'));
app.use(express.json());

app.set('views', path.join(__dirname, 'public/views'));
app.set('view engine', 'pug');

app.get('/', function (req, res) {
    const sectionTitle = 'SECTION_TITLE_TEXT_42';
    const products = [{

        imagePath: 'images/grafikkarte230.jpg',
        text: 'PRODUKT_TEXT_1',
        description: 'DESCRIPTION_1',
        price: '199,99'
    }, {
        imagePath: 'images/grafikkarte230.jpg',
        text: 'PRODUKT_TEXT_2',
        description: 'DESCRIPTION_2',
        price: '299,99'
    }, {
        imagePath: 'images/grafikkarte230.jpg',
        text: 'PRODUKT_TEXT_3',
        description: 'DESCRIPTION_3',
        price: '399,99'
    }, {
        imagePath: 'images/grafikkarte230.jpg',
        text: 'PRODUKT_TEXT_4',
        description: 'DESCRIPTION_4',
        price: '499,99'
    }];

    res.render('index', { sectionTitle: sectionTitle, products: products })
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
    res.render('shoppingcard');
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