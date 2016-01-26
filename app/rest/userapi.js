//get mongo connection for blog's 'entry' collection
var user = require('./connect_mongo.js').User;
var domain = require('./../domain/variables');

module.exports = {
	//given a username and password and whether the pw is hashed or not, validate
	//return true if found
	//return false if not found
	validateUser: function (usr, pw) {
        var query = user.find({
			'user': usr,
			'password': pw
		});
        
        return query;
    }
};