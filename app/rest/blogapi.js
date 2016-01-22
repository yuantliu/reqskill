//get mongo connection for blog's 'entry' collection
var blog = require('./connect_mongo.js');
var mongoose = require('mongoose');

module.exports = {
	getEntry : function (res) {
		blog.find({}).exec(function (err, result) {
			if (!err) {
				var i = JSON.stringify({"data": result});
                res.end(i)
			} else {
                res.send("Cannot fetch blog JSON from API");
            }
		})
	},
    
    
    postEntry : function(req, res){
        //todo: check cookies for user authentication
        var title = req.body.title;
        var date = new Date();
        var author = req.body.author;
        var content = req.body.post;
        
        var newentry = new blog({
            title: title,
            date: date,
            author: author,
            post: content
        });
        
        newentry.save(function(err, data){
            if(err){
                console.log("Error");
                res.send(err);
            } else {
                console.log("{data: " + data + "}");
                res.send("{data: " + data + "}")
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