//get mongo connection for entry collection
var api = require('./connect_mongo.js');

module.exports = {
	getEntry : function (res) {
		api.blog.find({}).exec(function (err, result) {
			if (!err) {
				var i = JSON.stringify(result);
				res.end(i);
			} else {
                res.end("Cannot fetch blog JSON from API");
            }
		})
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