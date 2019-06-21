/**
 * Lädt die Benutzerdaten   
 */
module.exports.load = function(req, res) {
    let userid = req.query.userid

    let sql = "select * from user inner join paymethod on user.paymethodID = paymethod.id where user.id = " + userid

    global.connection.query(sql, function(err, result) {
        if (err) throw err;

        res.render('details', { userdata: result[0] });
    });
}