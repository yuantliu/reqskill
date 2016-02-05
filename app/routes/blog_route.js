var domain = require('./../domain/variables');
var blogApi = require('./../rest/blogapi');
var userApi = require('./../rest/userapi');

//escaping input
var validator = require('validator');
//static files in file system
var path = require('path');
//hash library
var crypto = require('crypto');


module.exports = function (app) {

    app.route('/blog').get(function (req, res) {
        res.sendFile(path.join(__dirname + '../../../public/html/main.html'));
    });

    // blog entry related REST calls
    app.route('/blog/api')
        .get(function (req, res) {
            var query = blogApi.getEntries();
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
            var user = validator.escape(req.cookies.user);
            var password = validator.escape(req.cookies.pw);
            var query = userApi.validateUser(user, password);
            query.exec(function (err, result) {
                if (err || result.length != 1) {
                    //reset bad cookies
                    res.cookie("user", "");
                    res.cookie("pw", "");
                } else {
                    blogApi.postEntry(validator.escape(req.body.title), new Date(), validator.escape(req.body.author), validator.escape(req.body.content));
                }

                res.redirect('/blog');
            });
        });

    app.route('/blog/api/:_id')
        .delete(function (req, res) {
            //get and validate cookies first
            //get and validate cookies first
            var user = validator.escape(req.cookies.user);
            var password = validator.escape(req.cookies.pw);
            var query = userApi.validateUser(user, password);
            query.exec(function (err, result) {
                if (err || result.length != 1) {
                    //reset bad cookies
                    res.cookie("user", "");
                    res.cookie("pw", "");
                } else {
                    //delete entry
                    var query = blogApi.getEntry(req.params._id);
                    query.remove(function(err1, result1){
                        res.redirect('/blog');
                    });
                }
            });
        });

    //login handler
    app.route('/blog/login')
        .get(function (req, res) {
            var user = validator.escape(req.query.user);
            var password = crypto.Hash('sha256').update(validator.escape(req.query.pw) + domain.salt).digest('hex');
        
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
            var user = validator.escape(req.query.user);
            var password = validator.escape(req.query.pw);

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