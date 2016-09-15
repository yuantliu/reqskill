//REST interfaces

//service for persistent storing of user input city
searchApp.service('cityService', function(){
    this.city = '';
    this.days = 5;
});

//API
searchApp.service('urlService', function(){
    this.search = '/api/search';
});

searchApp.service('mainSearchService', ['$resource', 'urlService', function(resource, urlService){
    //consume the REST endpoint
    this.searchCity = function(city, days){
        var searchServiceAPI = resource(urlService.search + '/' + city + '/' + days);
        return searchServiceAPI.get();
    }
}]);