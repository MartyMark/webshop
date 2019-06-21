module.exports.submit = function(req, res) {
    let sql = "INSERT INTO user (surname, name, birthdate, city, street, zipcode, shipping_surname, shipping_name, shipping_city, shipping_street, shipping_zipcode, paymethodID, email, password) VALUES (\'#FIRSTNAME#\',\'#LASTNAME#\',\'#BIRTHDATE#\',\"#CITY#\",\"#STREET#\",\"#PLZ#\",\"#SHIPPINGSURNAME#\",\"#SHIPPINGNAME#\",\"#SHIPPINGCITY#\",\"#SHIPPINGSTREET#\",\"#SHIPPINGPLZ#\",\"#PAYMETHOD#\",\"#EMAIL#\",\"#PASSWORD#\")";

    sql = sql.replace("#FIRSTNAME#", req.body.firstName);
    sql = sql.replace("#LASTNAME#", req.body.lastName);
    sql = sql.replace("#BIRTHDATE#", req.body.birthdate);
    sql = sql.replace('#CITY#', req.body.city);
    sql = sql.replace('#STREET#', req.body.street);
    sql = sql.replace('#PLZ#', req.body.plz);
    sql = sql.replace('#SHIPPINGSURNAME#', req.body.firstName);
    sql = sql.replace('#SHIPPINGNAME#', req.body.lastName);
    sql = sql.replace('#SHIPPINGCITY#', req.body.city);
    sql = sql.replace('#SHIPPINGSTREET#', req.body.street);
    sql = sql.replace('#SHIPPINGPLZ#', req.body.plz);
    sql = sql.replace('#EMAIL#', req.body.email);
    sql = sql.replace('#PASSWORD#', req.body.pw);
    sql = sql.replace("#PAYMETHOD#", 1);

    console.log(sql)

    global.connection.query(sql, function(err, result) {
        if (err) throw err;
    });
    res.redirect('/login');
}