//ROUTE
blogApp.config(['$routeProvider', function (routeProvider) {
	routeProvider
		.when('/', {
			templateUrl: '/public/html/blog.html',
			controller: 'blogController'
		})
		.otherwise({
			redirectTo: '/'
		})
}]);