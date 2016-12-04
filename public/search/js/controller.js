//Search home controller
searchApp.controller('cityInputController', ['$scope', '$location', 'cityService', function (scope, location, cityService) {
    scope.$watch('city', function(){
        cityService.city = scope.city;
    });

    scope.$watch('days', function(){
        cityService.days = scope.days;
    })

    scope.submit = function(){
        location.path('/search/' + scope.city + "/" + scope.days)
    }

}]);

searchApp.controller('cityOutputController', ['$scope', '$routeParams', 'cityService', 'mainSearchService', function (scope, routeParams, cityService, mainSearchService) {
    cityService.city = routeParams.city;
    cityService.days = routeParams.days;
    scope.city = routeParams.city;
    scope.days = routeParams.days;
    scope.mydata = mainSearchService.searchCity(cityService.city, cityService.days);

    scope.$watch('mydata.data', function(){
        //ng-repeat will automatically run through the results
    }, true);

    scope.$watch('city')
}]);