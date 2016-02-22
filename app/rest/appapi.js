//get mongo connection
var db = require('./connect_mongo.js');
var mongoose = require('mongoose');

module.exports = {
	getStatus : function(city){ 
        var query = db.Status.find({city});
        return query;
    },
};