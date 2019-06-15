var express = require('express');
var mysql = require('mysql');
var app = express();

const path = require('path');

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded());

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, '/public/index.html'));
});

app.get('/index/:username', function(req, res) {

    var username = req.params.username;
    //res.render('index', { name: username }, function(err, html) {
    //html.getElementById('loginText').value = username;
    //});
    //res.render('index', { output: req.params.username });
    res.redirect('/');
});

app.get('/login', function(req, res) {
    res.status(200).sendFile(path.join(__dirname, '/public/login.html'));
});

app.post('/register/submit', function(req, res) {
    var name = req.body.name;
    var surname = req.body.surname;
    var street = req.body.street;
    var zipcode = req.body.zipcode;
    var email = req.body.email;
    var password = req.body.psw;

    var sql = "INSERT INTO user (VORNAME, name, street, zipcode, email, password) VALUES ('" + surname + "','" + name + "','" + street + "','" + zipcode + "','" + email + "','" + password + "')";

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
    if (!!error) {
        console.log('Error');
    } else {
        console.log('Connected');
    }
});

const PORT = process.env.PORT || 5500;

app.listen(PORT, () => console.log('Server started'));