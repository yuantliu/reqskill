//get mongo connection for blog's 'entry' collection
var db = require('./connect_mongo_blog').BlogEntry;
var mongoose = require('mongoose');

var Entries = db.BlogEntry;

module.exports = {
	getEntries : function(){ 
        var query = db.find({}).sort({date: -1});
        return query;
    },
    
    getEntry : function(id){
        var query = db.find({"_id": id});
        return query;
    },
    
    postEntry : function(title, date, author, content){
        //todo: check cookies for user authentication
        
        var newentry = new db({
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