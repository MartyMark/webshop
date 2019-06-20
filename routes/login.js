module.exports.submit = function (req, res) {
    console.log(req);
    console.log(req.body);
    console.log(req.body.username);
    console.log(req.body.psw);
    var username = req.body.username;
    var password = req.body.psw;
    let ip = req.connection.remoteAddress

    var sql = "SELECT * FROM user WHERE name = '" + username + "' and password = '" + password + "'";

    global.connection.query(sql, function (err, result) {
        if (err) throw err;

        if (!result.length) {
            res.redirect('/login');
            return;
        }
        global.userCache.set(ip, result[0].id);

        res.redirect('/index/' + username);
    });
}