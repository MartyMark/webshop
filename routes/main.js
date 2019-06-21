const utility = require(require('path').join(__dirname + '/../public/script/utility'));

module.exports.load = function(req, res, userid) {
    let sql = "SELECT * FROM product"

    let ip = req.connection.remoteAddress
    let productList = global.shoppingBagCache.get(ip)

    let count = utility.calculateTotalProductCount(productList)
    let totalAmount = utility.calculateTotalAmount(productList)

    global.connection.query(sql, function(err, result) {
        if (err) throw err;

        res.render('index', { sectionTitle: 'Topseller', products: result, count: count, totalAmount: totalAmount, userid: userid })
    });

    let products = [{
            id: 1,
            name: 'Test1',
            description: '11GB MSI GeForce RTX 2080 Ti VENTUS 11G Aktiv PCIe 3.0 x16',
            price: 199,
            image_path: 'images/graka.jpg',
            stock: 3
        },
        {
            id: 2,
            name: 'Test1',
            description: 'Dell 210-AGTR 68,6 cm (27 Zoll) UP2716D',
            price: 199,
            image_path: 'images/monitor.jpg',
            stock: 0
        },
        {
            id: 3,
            name: 'Test1',
            description: 'Asus ROG Maximus XI Hero Gaming',
            price: 199,
            image_path: 'images/mainboard.jpg',
            stock: 23
        },
        {
            id: 4,
            name: 'Test1',
            description: 'Intel® Core i9-9900K 8X 3.6GHz Boxed',
            price: 199,
            image_path: 'images/i9.jpg',
            stock: 23
        }
    ]
}