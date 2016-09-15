searchApp.config(['$routeProvider', function (routeProvider) {
    routeProvider
        .when('/', {
            templateUrl: '/public/search/html/city-input.html',
            controller: 'cityInputController'
        })
        .when('/search/:city/:days', {
            templateUrl: '/public/search/html/city-output.html',
            controller: 'cityOutputController'
        })
        .otherwise({
            redirectTo: '/'
        })
}]);