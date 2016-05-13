var appApi = require('./../rest/appapi');
var request = require('request');
var indeedKey = require('./../domain/keys').indeed_key;
var openweatherKey = require('./../domain/keys').openweather_key;
var cheerio = require('cheerio');
var async = require('async');
var math = require('mathjs');

//escaping input
var validator = require('validator');

//variables and functions for indeed

//search term for indeed
var term1 = "developer";

var searchTerm = require('./../domain/searchterms').terms;

//given an iteration number, return a function that would navigate to that iteration's Indeed API page and give the callback an array of links
//flip the pages so to speak
var flip = function (city, country, days, i) {
    return function (callback) {
        request(`http://api.indeed.com/ads/apisearch?publisher=${indeedKey}&format=json&q=${term1}&l=${city}&co=${country}&sort=&radius=&st=&jt=&start=${i * 25}&limit=25&fromage=${days}&filter=&chnl=&userip=1.2.3.4&v=2`, function (e, r, b) {
            var links = [];

            if (!e && b!= null || b!= undefined) {
                //go to each page and print out
                var results = JSON.parse(b).results;
                for (var j = 0; j < results.length; j++) {
                    //url is pushed here
                    links.push(results[j].url);
                }

                callback(null, links);
            } else {
                console.log("Error in flip function at page " + i);
                //return an empty function
                callback(null, links);
            }
        });
    }
};

//given a url string for a job posting and a counter object, return a function for execution by async
//function looks up a given url and if a term exists in #job-summary, then store the term in an array 
//pass array to callback function
var extract = function (url, counter) {
    return function (callback) {
        request(url, function (error, response, body) {
            
            //error checking if a page has problems
            if(body == null || error != null){
                console.log("Error encountered at " + url);
                callback(null, null);
                return;
            }
            
            var $ = cheerio.load(body);
            //select the job summary id
            body = $("#job_summary").html();
            
            //lowercase the body
            //do error checking for when the id doesnt exist (because of redirect to a non-Indeed page)
            if(body == null){
                console.log("No job_summary id at " + url);
                callback(null, null);
                return;
            }
            body = body.toLowerCase();
       
            //count by reading the terms in /app/domain/searchterms.js
            for (var i = 0; i < searchTerm.length; i++) {
                if (body.indexOf(searchTerm[i]) > -1) {
                    if(counter[searchTerm[i]] != undefined && counter[searchTerm[i]] > 0)
                        counter[searchTerm[i]]++;
                    else {
                        counter[searchTerm[i]] = 1;
                    }
                }
            }
            
            setTimeout(function(){
                callback(null, null);
            }, math.randomInt(500, 1500));
            
            
        });
    }
}

module.exports = function (app) {

    app.route('/api/search/:_city/:_days')
        .get(function (req, res) {
            //escape input
            var city = validator.escape(req.params._city);
            var days = parseInt(validator.escape(req.params._days));
            var country = '';
            
            //find the country for a given city by using the openweathermap api
            request(`http://api.openweathermap.org/data/2.5/forecast/daily?appid=${openweatherKey}&cnt=1&q=${city}`, function (error, response, weather_body) {
                country = JSON.parse(weather_body).city.country;

                request(`http://api.indeed.com/ads/apisearch?publisher=${indeedKey}&format=json&q=${term1}&l=${city}&co=${country}&sort=&radius=&st=&jt=&start=0&limit=25&fromage=${days}&filter=&chnl=&userip=1.2.3.4&v=2`, function (error, response, indeed_search_body) {
                    //get number of postings
                    var indeed_result = JSON.parse(indeed_search_body);
                    var num = indeed_result.totalResults;
                    
                    //calculate total number of iterations because indeed only returns 25 results at a time
                    var iterations = num / 25;
                    
                    //function to execute the flip functions, get all the links
                    var flipFunctionQueue = [];
                    for (var i = 0; i < iterations; i++) {
                        flipFunctionQueue.push(flip(city, country, days, i));
                    }
                    var flipFunction = function (callback) {
                        async.parallel(flipFunctionQueue, function (err, results) {
                            var links = [];
                            for (var i = 0; i < results.length; i++) {
                                for (var j = 0; j < results[i].length; j++) {
                                    links.push(results[i][j]);
                                }
                            }
                            
                            //give links to extractFunction
                            callback(null, links);
                        });
                    }
                    
                    //given array of links from flipFunction, create extract functions and execute them
                    var extractFunction = function(url, callback){
                        //take links and fill an array with functions that does extraction
                        var extractQueue = [];
                        //store extracted results in an object
                        var count = {};
                        for(var i = 0; i < url.length; i++){
                            extractQueue.push(extract(url[i], count));
                        }
                        
                        async.series(extractQueue, function(err, results){
                            //results are in skill results
                            //pass via callback
                            callback(null, count);
                        });
                    }
                    
                    //grand async waterfall function
                    //execute the functions in flipFunctionQueue by executing flipFunction
                    //then execute the functions in extractFunctionQueue by executing extractFunction
                    async.waterfall([flipFunction, extractFunction], function(err, result){
                        //output the skill_results
                        res.end(result);
                    });

                    res.end(indeed_search_body);

                });
            });
        });

};