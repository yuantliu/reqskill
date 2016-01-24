//get mongo connection for blog's 'entry' collection
var user = require('./connect_mongo.js').User;
var mongoose = require('mongoose');

module.exports = {
    //given a username and password, validate
	//return true if found
	//return false if not found
	userLogin : function (res, usr, pw) {
		user.find({'user': usr, 'password': pw}).exec(function (err, result) {
            //connected
			if (err || result.length != 1) {
                res.end(JSON.stringify({"status": false}));
			} else {
                res.end(JSON.stringify({"status": true}));
            }
		})
	},
    validateCookie: function (res) {
        
    }
};

/*
var userSchema = new Schema({
	name: String
}, {collection: 'user'});*/

//var User = mongoose.model('User', userSchema);

/*var lyt = new User({name: "lyt"});
lyt.save(function(err, success){
	if(!err){
		console.log("Successful entry");
	}
});*/