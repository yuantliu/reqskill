//get mongo connection for blog's 'entry' collection
var blog = require('./connect_mongo.js');
var mongoose = require('mongoose');

module.exports = {
	getEntry : function (res) {
		blog.BlogEntry.find({}).sort({date: -1}).exec(function (err, result) {
			if (!err) {
				var i = JSON.stringify({"data": result});
                res.end(i);
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
        
        var newentry = new blog.BlogEntry({
            title: title,
            date: date,
            author: author,
            post: content
        });
        
        newentry.save(function(err, data){
            if(err){
                console.log("Error during Blog POSTing");
                console.log(err);
            }
        })
    }
};