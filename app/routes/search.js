var appApi = require('./../rest/appapi');
var request = require('request');
var indeedKey = require('./../domain/keys').indeed_key;
var MAX_DAYS = require('./../domain/keys').MAX_DAYS;
var openweatherKey = require('./../domain/keys').openweather_key;
var cheerio = require('cheerio');
var async = require('async');
var math = require('mathjs');
var moment = require('moment-timezone');
moment().tz('America/Toronto').format();

//escaping input
var validator = require('validator');

//database connection
var cityApi = require('./../rest/appapi');

//search term for indeed
var term1 = "developer";
var term2 = "software";

var searchTerm = require('./../domain/searchterms');

//number of milliseconds in a day.
const DAY_CONSTANT = 1000 * 60 * 60 * 24;

//given an iteration number, return a function that would navigate to that iteration's Indeed API page and give the callback an array of links
//flip the pages so to speak
var flip = function (city, country, days, i) {
    return function (callback) {
        request(`http://api.indeed.com/ads/apisearch?publisher=${indeedKey}&format=json&q=${term2}&q=${term1}&l=${city}&co=${country}&sort=&radius=&st=&jt=&start=${i * 25}&limit=25&fromage=${days}&filter=&chnl=&userip=1.2.3.4&v=2&latlong=1`, function (e, r, b) {
            var links = {};
            //links = {<date>: [link, link, link]}

            if (!e && b != null || b != undefined) {
                //go to each page and print out
                var results = JSON.parse(b).results;
                for (var j = 0; j < results.length; j++) {
                    var isoTime = results[j].date;
                    var date = (new Date(isoTime)).toISOString().substring(0, 10);

                    if (links[date] == null || links[date].length == 0) {
                        links[date] = [];
                    }
                    //url is pushed here
                    links[date].push(results[j].url);
                }

                callback(null, links);
            } else {
                console.log("Error in flip function at page " + i + ". Cannot get page from indeed.");
                //return an empty function
                callback(null, links);
            }
        });
    }
};

//given a url string for a job posting and a counter object, return a function for execution by async
//function looks up a given url and if a term exists in #job-summary, then store the term in an array 
//pass array to callback function
var extract = function (url, date) {
    return function (callback) {
        request(url, function (error, response, body) {

            var counter = {};

            if(counter[date] == undefined){
                counter[date] = {};
            }

            //error checking if a page has problems
            if (body == null || error != null) {
                console.log("Error encountered at " + url);
                callback(null, counter);
                return;
            }

            var $ = cheerio.load(body);
            //select the job summary id
            body = $("#job_summary").html();

            //lowercase the body
            //do error checking for when the id doesnt exist (because of redirect to a non-Indeed page)
            if (body == null) {
                console.log("No job_summary id at " + url);
                callback(null, null);
                return;
            }
            body = body.toLowerCase();

            //count by reading the terms in /app/domain/searchterms.js
            for (var i = 0; i < searchTerm.term.length; i++) {
                if (body.search(searchTerm.term[i] + searchTerm.regexend) > -1) {
                    if (counter[date][searchTerm.term[i]] != undefined && counter[date][searchTerm.term[i]] > 0) {
                        counter[date][searchTerm.term[i]]++;
                    }
                    else {
                        counter[date][searchTerm.term[i]] = 1;
                    }
                }
            }

            setTimeout(function () {
                callback(null, counter);
            }, math.randomInt(100, 200));
        });
    }
}

var getRequest = function (city, days, country) {
    return function(callback){
        request(`http://api.indeed.com/ads/apisearch?publisher=${indeedKey}&format=json&q=${term1}&l=${city}&co=${country}&sort=&radius=&st=&jt=&start=0&limit=25&fromage=${days}&filter=&chnl=&userip=1.2.3.4&v=2`, function (error, response, indeed_search_body) {
            //get number of postings
            var indeed_result = JSON.parse(indeed_search_body);
            var num = indeed_result.totalResults;

            var flipFunction = function (callback) {

                //calculate total number of iterations because indeed only returns 25 results at a time
                var iterations = num / 25;

                //function to execute the flip functions, get all the links
                var flipFunctionQueue = [];
                for (var i = 0; i < iterations; i++) {
                    flipFunctionQueue.push(flip(city, country, days, i));
                }

                async.parallel(flipFunctionQueue, function (err, data) {
                    //give results to extractFunction
                    callback(null, data);
                });
            }

            //given array of links from flipFunction, create extract functions and execute them
            var extractFunction = function (data, callback) {

                //data
                //each flipped pages have their own date-links object
                //combined object looks like this
                //[{date: [links]}, {date:[links], date:[links]}]

                //want to transform to
                //{date: [links], date: [links]}

                var transformedData = {};

                for (var i = 0; i < data.length; i++) {
                    //look into each object
                    var current = data[i];
                    
                    var keys = [];
                    Object.keys(data[i]).forEach(function(key){
                        keys.push(key);
                    });

                    keys.forEach(function (element) {
                        if(transformedData[element] == null || transformedData[element].length == 0){
                            transformedData[element] = [];
                        }

                        //add all the links for this date to transformedData
                        for(var j = 0; j < current[element].length; j++){
                            transformedData[element].push(current[element][j]);
                        }
                    });
                }

                var extractQueue = [];

                //store extracted results in an object
                var date_keys = Object.keys(transformedData);
                for (var i = 0; i < date_keys.length; i++) {
                    for(var j = 0; j < transformedData[date_keys[i]].length; j++){
                        extractQueue.push(extract(transformedData[date_keys[i]][j], date_keys[i]));
                    }
                }

                async.series(extractQueue, function (err, results) {
                    //results is an array with each extract function's results.
                    //sum them up and pass to waterfall

                    var result = {}; //singular final result
                    for(var i = 0; i < results.length; i++){
                        //get the date
                        var date = (Object.keys(results[i]))[0];
                        if(result[date] == undefined){
                            result[date] = {};
                        }
                        
                        //skills
                        var skills = Object.keys(results[i][date]);
                        if(skills.length > 0){
                            for(var j = 0; j < skills.length; j++){
                                if(result[date][skills[j]] == undefined){
                                    result[date][skills[j]] = results[i][date][skills[j]];
                                } else {
                                    result[date][skills[j]] += results[i][date][skills[j]];
                                }
                            }
                        }
                        
                    }
                    callback(null, result);
                });
            }

            //grand async waterfall function
            //execute the functions in flipFunctionQueue by executing flipFunction
            //then execute the functions in extractFunctionQueue by executing extractFunction
            async.waterfall([flipFunction, extractFunction], function (err, data) {
                if(err){
                    console.log("Something went wrong in waterfall");
                } else {
                    callback(null, data);
                }
            });
        });//end request to indeed
    }
};

module.exports = function (app) {

    //race condition
    var lock = {};

    app.route('/api/search/:_city/:_days')
        .get(function (req, res) {

            //escape input
            var city = validator.escape(req.params._city);
            var days = parseInt(validator.escape(req.params._days));
            var country = '';

            //check if number of days is too much
            if (days > MAX_DAYS) {
                res.end(JSON.stringify({ "error": "Number of days requested is too high. App can only retrieve up to 14 days." }));
                return;
            }


            //find the country for a given city by using the openweathermap api
            request(`http://api.openweathermap.org/data/2.5/forecast/daily?appid=${openweatherKey}&cnt=1&q=${city}`, function (error, response, weather_body) {
                country = JSON.parse(weather_body).city.country;

                //Mongo Database query

                //retrieve city + country from mongo
                var dbquery = cityApi.getCityData(city, country);
                //find which dates that the request wants
                dbquery.exec(function (err, mongo_query_result) {

                    //holds the retrieved city data
                    var city_data = null;

                    //find which dates the request wants
                    //formattedRelativeTime: '1 day ago'

                    //1
                    //if DB query has no result, create new object
                    //else retrieve object
                    if (mongo_query_result.length == 0) {
                        city_data = {
                            "updated": null,
                            "city": city,
                            "country": country,
                            "data": null
                        }
                    } else {
                        city_data = mongo_query_result[0];
                    }

                    //respond during creation or updating of mongo record
                    var respondWithWait = function() {
                        res.end(JSON.stringify({ "error": "Job has been queued. Please check back in a bit to see results." }));

                        async.series([getRequest(city, days, country)], function(error, data){
                            //data has the JSON
                        });
                        
                    }

                    //2
                    //check updated
                    //if null, get last 14 days of data then save. set updated to current date
                    //if not today, calculate missing days (i.e. # of days between last updated and today), update object and updated
                    //if today, do nothing
                    if (city_data.updated == null) {
                        days = 1;
                        respondWithWait();
                    } else if (moment(new Date()).diff(moment(city_data.updated), "days") > 1) {
                        //# of days between today and last updated
                        days = moment(city_data.updated).diff(moment(new Date()), "days");
                        respondWithWait();
                    } else {
                        //get data straight from DB
                        console.log("Already got all this");
                    }
                });


            });
        });
};