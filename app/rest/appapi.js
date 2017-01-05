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
    
    updateCityData : function(newData, id){
        //for when id != null
        //ie just updating
        if(id != null){
            var query = db.find({"_id": id});
            db.findOneAndUpdate(query, newData, function(err, res){
                if(err){
                    console.log("Error during city update");
                    console.log(err);
                } else {
                    console.log("City updated successfully");
                }
            })
        } else {
            var newentry = new db({
                city: newData.city,
                country: newData.country,
                updated: newData.updated,
                data: newData.data
            });
            db.save(newData);
        }
        
    },
};