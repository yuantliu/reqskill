var mongoose = require('mongoose');
var db = require('../domain/keys');
var Schema = mongoose.Schema;

mongoose.connect(db.db_url, function (err, res) {
	if (err) {
		console.log("Can't connect to mongodb for cities");
	}
});