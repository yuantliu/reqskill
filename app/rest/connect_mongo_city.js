var mongoose = require('mongoose');
var key = require('../domain/keys').db_city_url;
var Schema = mongoose.Schema;

var cityConnection = mongoose.createConnection(key, function (err, res) {
	if (err) {
		console.log("Can't connect to mongodb for city");
        console.log(err);
	}
});

cityConnection.on('connected', function(){
    console.log("City db connection established");
});


//pass in the second object specifying the collection name
//might have something to do with the fact that this collection existed before

var citySchema = mongoose.Schema({
	city: String,
	country: String,
	lastUpdated: String,
	data: [Schema.Types.Mixed] //array will be {<date>: {java: 3, nodejs: 5}}
}, {
	collection: 'cities'
});

var CityEntry = cityConnection.model('CityEntry', citySchema);

module.exports = { "CityEntry": CityEntry};