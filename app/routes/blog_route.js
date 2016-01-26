var domain = require('./../domain/variables');
var blogApi = require('./../rest/blogapi');
var userApi = require('./../rest/userapi');

var path = require('path');
//hash library
var crypto = require('crypto');


module.exports = function (app) {

    app.route('/blog').get(function (req, res) {
        res.sendFile(path.join(__dirname + '../../../public/html/main.html'));
    });

    //retrieve blog entries

    //have to pass in res for api to send response back for now due to asynchronous function issues
    app.route('/blog/api')
        .get(function (req, res) {
            var query = blogApi.getEntry();
            query.exec(function (err, data) {
                if (err) {
                    console.log("Error in GET blog");
                    res.end('{data: null}');
                } else {
                    res.end(JSON.stringify({ "data": data }));
                }
            });
        })
        .post(function (req, res) {
            //get and validate cookies first
            var user = req.cookies.user;
            var password = req.cookies.pw;
            var query = userApi.validateUser(user, password);
            query.exec(function (err, result) {
                if (err || result.length != 1) {
                    //reset bad cookies
                    res.cookie("user", "");
                    res.cookie("pw", "");
                } else {
                    blogApi.postEntry(req.body.title, new Date(), req.body.author, req.body.content);
                }
                
                res.redirect('/blog');
            });
        });

    //login handler
    app.route('/blog/login')
        .get(function (req, res) {
            var user = req.query.user;
            var password = crypto.Hash('sha256').update(req.query.pw + domain.salt).digest('hex');
        
            //find user in db and set cookie if ok
            var query = userApi.validateUser(user, password);
            query.exec(function (err, result) {
                if (!err && result.length == 1) {
                    res.cookie("user", result[0].user);
                    res.cookie("pw", result[0].password);
                }

                res.redirect('/blog');
            });
        });

    //cookie authentication service
    //blog/auth?user=u&pw=p
    app.route('/blog/auth')
        .get(function (req, res) {
            var user = req.query.user;
            var password = req.query.pw;

            var query = userApi.validateUser(user, password);
            query.exec(function (err, result) {
                if (err || result.length != 1) {
                    //reset bad cookies
                    res.cookie("user", "");
                    res.cookie("pw", "");
                    res.end(JSON.stringify({ "status": false }));
                } else {
                    res.end(JSON.stringify({ "status": true }));
                }
            });
        });

};