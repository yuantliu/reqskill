//get mongo connection for blog's 'entry' collection
var blog = require('./connect_mongo.js');
var mongoose = require('mongoose');

module.exports = {
	getEntry : function(){ 
        var query = blog.BlogEntry.find({}).sort({date: -1});
        return query;
    },
    
    postEntry : function(title, date, author, content){
        //todo: check cookies for user authentication
        
        var newentry = new blog.BlogEntry({
            title: title,
            date: date,
            author: author,
            post: content
        });
        
        newentry.save(function(err, data){
            if(err){
                console.log("Error during POST: " + err);
            }
        })
    }
};