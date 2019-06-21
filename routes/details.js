module.exports.load = function(req, res) {
    let personenDaten = {
        salutation: 'Herr',
        lastName: 'Busanny',
        firstName: 'Tim',
        birthDate: '11.04.1989',
        email: 'tim.busanny@gmail.com',
        invoiceAddress: {
            salutation: 'Herr',
            lastName: 'Busanny',
            firstName: 'Tim',
            street: 'Königstr.',
            town: 'Warendorf',
            plz: '48231',
            houseNumber: '12',
            countryCode: 'DE',
            country: 'Deutschland',
        },
        payMethod: 'PayPal',
        sameAddress: false,
        shippingAddress: {
            salutation: 'Herr',
            lastName: 'Busanny',
            firstName: 'Tim',
            street: 'Königstr.',
            town: 'Warendorf',
            plz: '48231',
            houseNumber: '12',
            countryCode: 'DE',
            country: 'Deutschland',
        },
    }

    let userid = req.query.userid

    let sql = "select * from user inner join paymethod on user.paymethodID = paymethod.id where user.id = " + userid

    global.connection.query(sql, function(err, result) {
        if (err) throw err;

        res.render('details', { userdata: result[0] });
    });
}