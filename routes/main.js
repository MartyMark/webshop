const utility = require(require('path').join(__dirname + '/../public/script/utility'));

module.exports.load = function(req, res, userid) {
    let sql = "SELECT * FROM product"

    let ip = req.connection.remoteAddress
    let productList = global.shoppingBagCache.get(ip)

    let count = utility.calculateTotalProductCount(productList)
    let totalAmount = utility.calculateTotalAmount(productList)

    global.connection.query(sql, function(err, result) {
        if (err) throw err;

        res.render('index', { sectionTitle: 'SECTION_TITLE_TEXT_42', products: result, count: count, totalAmount: totalAmount, userid: userid })
    });
}