module.exports.load = function (req, res) {
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

    res.render('details', { personenDaten: personenDaten });
}