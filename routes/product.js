module.exports.info = function (req, res) {
    let productID = req.query.id,
        sql = "select * from product where id =" + productID

    connection.query(sql, function (err, result) {
        if (err) throw err;

        res.render('productInfo', { product: result[0] });
    });
}