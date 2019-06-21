/**
 * Berechnet den Gesamtpreis aller ausgewählter Produkte.
 */
module.exports.calculateTotalAmount = function(productList) {
    let totalAmount = 0;

    if (typeof productList !== 'undefined') {
        productList.forEach(element => {
            totalAmount += parseFloat(element.price)
        });
    }
    return String(Number(totalAmount).toFixed(2))
}


/**
 * Berechnet die gesamte Anzahl aller ausgewählter Produkte.
 */
module.exports.calculateTotalProductCount = function(productList) {
    let count = 0;

    if (typeof productList !== 'undefined') {
        count = productList.length
    }
    return count;
}