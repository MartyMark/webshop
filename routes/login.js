module.exports.submit = function(req, res) {
    var email = req.body.email;
    var password = req.body.psw;
    let ip = req.connection.remoteAddress

    var sql = "SELECT * FROM user WHERE email = '" + email + "' and password = '" + password + "'";

    console.log(sql)

    global.connection.query(sql, function(err, result) {
        if (err) throw err;

        if (!result.length) {
            res.redirect('/login');
            return;
        }
        let userid = result[0].id

        global.userCache.set(ip, userid);

        res.redirect('/index/' + userid);
    });
}