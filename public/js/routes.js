//ROUTE
blogApp.config(['$routeProvider', function (routeProvider) {
	routeProvider
		.when('/blog', {
			templateUrl: 'blog.html',
			controller: 'blogController'
		})
		.when('/blog/:id', {
			templateUrl: 'html/entry.html',
			controller: 'forecastController'
		})
		.otherwise({
			redirectTo: '/'
		})
}]);