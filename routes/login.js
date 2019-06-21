/**
 * Loggt den Benutzer ein.
 * Wurde kein User gefunden, wird der Benutzer wieder auf die Loginseite geführt.
 */
module.exports.submit = function(req, res) {
    var email = req.body.email;
    var password = req.body.psw;
    let ip = req.connection.remoteAddress;

    var sql = "SELECT * FROM user WHERE email = '" + email + "' and password = '" + password + "'";

    global.connection.query(sql, function(err, result) {
        if (err) throw err;

        if (!result.length) {
            res.redirect('/login');
            return;
        }
        let userid = result[0].id;

        //Die Benutzer werden anhand der IP gemappt und dann in einen gloaben Cache geführt.
        global.userCache.set(ip, userid);

        res.redirect('/index/' + userid);
    });
}