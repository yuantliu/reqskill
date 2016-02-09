var mongoose = require('mongoose');
var db = require('../domain/database');
var Schema = mongoose.Schema;

mongoose.connect(db.url, function (err, res) {
	if (err) {
		console.log("Can't connect to mongodb");
	}
});

//pass in the second object specifying the collection name
//might have something to do with the fact that this collection existed before
var blogSchema = new Schema({
	title: String,
	date: {type: Date, default: Date.now},
	author: String,
	post: String
}, {
	collection: 'entries'
});

var userSchema = new Schema({
    user: String,
    password: String,
    salt: String
}, {
    collection: 'users' 
});

var BlogEntry = mongoose.model('MyEntry', blogSchema);
var User = mongoose.model('User', userSchema);

module.exports = { "BlogEntry": BlogEntry, "User": User };