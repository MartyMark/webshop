module.exports.load = function (req, res) {
    let sql = "SELECT * FROM product"

    let ip = req.connection.remoteAddress
    let productList = global.shoppingBagCache.get(ip)

    let count = calculateTotalProductCount(productList)
    let totalAmount = calculateTotalAmount(productList)

    connection.query(sql, function (err, result) {
        if (err) throw err;

        res.render('index', { sectionTitle: 'SECTION_TITLE_TEXT_42', products: result, count: count, totalAmount: totalAmount })
    });
}

function _calculateTotalAmount(productList) {
    let totalAmount = 0;

    if (typeof productList !== 'undefined') {
        productList.forEach(element => {
            totalAmount += parseFloat(element.price)
        });
    }
    return String(Number(totalAmount).toFixed(2))
}

function _calculateTotalProductCount(productList) {
    let count = 0;

    if (typeof productList !== 'undefined') {
        count = productList.length
    }
    return count;
}