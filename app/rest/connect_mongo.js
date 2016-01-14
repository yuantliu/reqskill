var mongoose = require('mongoose');
var Schema = mongoose.Schema;

mongoose.connect('mongodb://localhost/test', function (err, res) {
	if (err) {
		console.log("Can't connect to mongodb");
	}
});

//pass in the second object specifying the colection name
//might have something to do with the fact that this database didnt exist before
var blogSchema = new Schema({
	title: String,
	date: {type: Date, default: Date.now},
	author: String,
	post: String
}, {
	collection: 'entry'
});

var blog = mongoose.model('MyEntry', blogSchema);

module.exports = {
    blog: blog
}