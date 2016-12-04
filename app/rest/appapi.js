//get mongo connection
var db = require('./connect_mongo_city').CityEntry;
var mongoose = require('mongoose');


/*
var citySchema = mongoose.Schema({
	city: String,
	country: String,
	lastUpdated: String,
	data: [Schema.Types.Mixed] //array will be {<date>: {java: 3, nodejs: 5}}
}, {
	collection: 'cities'
});


*/
module.exports = {
	getCityData : function(city, country){ 
        return db.find({"city": city, "country": country});
    },
    
    updateCityData : function(id, newData){
        var query = db.find({"_id": id});
        db.findOneAndUpdate(query, newData, function(err, res){
            if(err){
                console.log("Error during city update");
                console.log(err);
            } else {
                console.log("City updated successfully");
            }
        })
    },
};