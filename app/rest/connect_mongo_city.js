var mongoose = require('mongoose');
var db = require('../domain/keys');
var Schema = mongoose.Schema;

mongoose.createConnection(db.db_city_url, function (err, res) {
	if (err) {
		console.log("Can't connect to mongodb for cities");
		console.log(err);
	}
});

