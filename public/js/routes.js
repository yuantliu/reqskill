blogApp.config(['$routeProvider', function (routeProvider) {
	routeProvider
		.when('/', {
			templateUrl: '/public/html/blog.html',
			controller: 'blogController'
		})
        .when('/newPost', {
            templateUrl: '/public/html/newentry.html'
        })
        .when('/login'), {
            templateUrl: 'public/html/login.html'  
        })
		.otherwise({
			redirectTo: '/'
		})
}]);