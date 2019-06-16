const express = require('express');
const mysql = require('mysql');
const path = require('path');

const app = express();

app.use(express.static('public'));
app.use(express.json());

app.set('views', path.join(__dirname, 'public/views'));
app.set('view engine', 'pug');

app.get('/', function(req, res) {
    const sectionTitle = 'SECTION_TITLE_TEXT_42';

    let sql = "SELECT * FROM product"

    connection.query(sql, function(err, result) {
        if (err) throw err;

        res.render('index', { sectionTitle: sectionTitle, products: result })
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
    let items = [
        {
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


    console.log(items);
    res.render('shoppingcard', { items: items });
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
        console.log("user-record inserted");
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