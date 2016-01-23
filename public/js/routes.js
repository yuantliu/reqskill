//ROUTE
blogApp.config(['$routeProvider', function (routeProvider) {
	routeProvider
		.when('/', {
			templateUrl: '/public/html/blog.html',
			controller: 'blogController'
		})
        .when('/newPost', {
            templateUrl: '/public/html/newentry.html',
            controller: 'newPostController'
        })
		.otherwise({
			redirectTo: '/'
		})
}]);