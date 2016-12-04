var mongoose = require('mongoose');
var db = require('../domain/keys');
var Schema = mongoose.Schema;

var blogConnection = mongoose.createConnection(db.db_blog_url, function (err, res) {
	if (err) {
		console.log("Can't connect to mongodb for blog");
        console.log(err);
	}
});

blogConnection.on('connected', function(){
    console.log("Blog db connection established");
});


//pass in the second object specifying the collection name
//might have something to do with the fact that this collection existed before

//blog Schemas
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

//app collections
var statusSchema = new Schema({
    city: String,
    country: String,
    status: Boolean
}, {
    collection: 'status'
})

var BlogEntry = blogConnection.model('MyEntry', blogSchema);
var User = blogConnection.model('User', userSchema);
var Status = blogConnection.model('Status', statusSchema);

module.exports = { "BlogEntry": BlogEntry, "User": User, "Status": Status };