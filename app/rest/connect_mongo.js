var mongoose = require('mongoose');
var Schema = mongoose.Schema;

mongoose.connect('mongodb://localhost/test', function (err, res) {
	if (err) {
		console.log("Can't connect to mongodb");
	}
});

//pass in the second object specifying the collection name
//might have something to do with the fact that this collection didnt exist before
var blogSchema = new Schema({
	title: String,
	date: {type: Date, default: Date.now},
	author: String,
	post: String
}, {
	collection: 'entry'
});

var BlogEntry = mongoose.model('MyEntry', blogSchema);

module.exports = BlogEntry;