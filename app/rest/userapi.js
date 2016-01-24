//get mongo connection for blog's 'entry' collection
var user = require('./connect_mongo.js').User;
var domain = require('./../domain/variables');


var crypto = require('crypto');

module.exports = {
    //given a username and password and whether the pw is hashed or not, validate
	//return true if found
	//return false if not found
	validateLogin : function (res, usr, pw, hashed) {
		//if not cookie, hash password
		if(hashed == false){
			pw = crypto.Hash('sha256').update(pw + domain.salt).digest('hex');
		}
		
		user.find({'user': usr, 'password': pw}).exec(function (err, result) {
            //connected
			if (err || result.length != 1) {
                res.end(JSON.stringify({"status": false}));
			} else {
                res.end(JSON.stringify({"status": true}));
            }
		})
	}
};