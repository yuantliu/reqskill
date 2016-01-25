//get mongo connection for blog's 'entry' collection
var user = require('./connect_mongo.js').User;
var domain = require('./../domain/variables');


var crypto = require('crypto');

module.exports = {
	//given a username and password and whether the pw is hashed or not, validate
	//return true if found
	//return false if not found
	validateUser: function (res, usr, pw, hashed) {
		//if not cookie, hash password
		if (hashed == 0) {
			pw = crypto.Hash('sha256').update(pw + domain.salt).digest('hex');
		}

		user.find({
			'user': usr,
			'password': pw
		}).exec(function (err, result) {
			//JSON return for cookies
			if (hashed == true) {
				if (err || result.length != 1) {
                    //someone is using bad cookies. clear them
					res.cookie("user", "");
                    res.cookie("pw", "");
					res.end(JSON.stringify({
						"status": false
					}));
				} else {
					res.end(JSON.stringify({
						"status": true
					}));
				}
			} 
			//Login page
			else if(hashed == false){
				//no errors
				//set cookies
                console.log("Login in");
				if (!err && result.length == 1){
					res.cookie("user", result[0].user);
                    res.cookie("pw", result[0].password);
                    console.log("Cookies set");
				}
				
				res.redirect('/blog');
			}

		})
	}
};