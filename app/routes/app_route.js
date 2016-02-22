var appApi = require('./../rest/appapi');
var request = require('request');
var keys = require('./../domain/keys');

//escaping input
var validator = require('validator');

module.exports = function (app) {

    app.route('/api/search/:_city/:_days')
        .get(function (req, res) {
            //escape input
            var city = validator.escape(req.params._city);
            var days = parseInt(validator.escape(req.params._days));
            var country = '';
            
            //find the country
            request(`http://api.openweathermap.org/data/2.5/forecast/daily?appid=${keys.openweather_key}&cnt=1&q=${city}`, function(error, response, weather_body){
                country = JSON.parse(weather_body).city.country;
                
                //query indeed
                var term1 = "developer";
                
                request(`http://api.indeed.com/ads/apisearch?publisher=${keys.indeed_key}&format=json&q=${term1}&l=${city}&co=${country}&sort=&radius=&st=&jt=&start=0&limit=25&fromage=${days}&filter=&chnl=&userip=1.2.3.4&v=2`, function(error, response, indeed_search_body){
                    //var indeed_result = JSON.parse(indeed_search_body);
                    res.end(indeed_search_body);
                    
                    
                    var indeed_result = JSON.parse(indeed_search_body);
                    
                    //get number of postings
                    var num = indeed_result.totalResults;
                    
                    //calculate total number of iterations because indeed only returns 25 results at a time
                    var iterations = num/25;
                    if(num%25 == 0) iterations--;
                    
                    
                    //given an iteration number, navigate to that iteration's indeed API page
                    //then do some action 
                    var flip = function(i){
                        request(`http://api.indeed.com/ads/apisearch?publisher=${keys.indeed_key}&format=json&q=${term1}&l=${city}&co=${country}&sort=&radius=&st=&jt=&start=${i*25}&limit=25&fromage=${days}&filter=&chnl=&userip=1.2.3.4&v=2`, function(e, r, b){
                            //go to each page and print out 
                            var results = JSON.parse(b).results;
                            for(var j = 0; j < results.length; j++){
                                console.log(`Page ${i}: ${results[j].company}`);
                            }
                        });
                    }
                    
                    for(var i = 1; i < iterations; i++){
                        flip(i);
                    }
                    
                });
            });
        });

};