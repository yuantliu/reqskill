blogApp.config(['$routeProvider', function (routeProvider) {
    routeProvider
        .when('/', {
            templateUrl: '/public/blog/html/blog.html',
            controller: 'blogController'
        })
        .when('/newPost', {
            templateUrl: '/public/blog/html/newentry.html',
            controller: 'newPostController'
        })
        .when('/login', {
            templateUrl: '/public/blog/html/login.html'
        })
        .otherwise({
            redirectTo: '/'
        })
}]);