//Blog home controller

//listen for route's onchange events and execute validation from service before route change
blogApp.run(['$rootScope', 'validateCookieService', function (rootScope, validateCookieService) {
	rootScope.$on('$routeChangeSuccess', function() {
		validateCookieService.get();
    })
}]);

//app's root controller
//parse cookies: if username and password are incorrect, wipe cookie, say "Login"
//otherwise: say "New Post"
blogApp.controller('topBarLoginController', ['$scope', '$rootScope', 'validateCookieService', function (scope, rootScope, validateCookieService) {    
    //need to have loggedIn stored in rootScope so that blogApp.run will be able to access it.
    rootScope.loggedIn = false;
    
    rootScope.$watch('loggedIn', function () {
        if (rootScope.loggedIn == true) {
            scope.link_text = "New Post";
            scope.link = "#newPost"
        } else {
            scope.link_text = "Login here";
            scope.link = "#login";
        }
    });
}]);

//Get entries from REST API
blogApp.controller('blogController', ['$scope', '$location', 'mainBlogService', function (scope, $location, blogService) {
    //get entries from REST
    scope.entries = blogService.get();
}]);

//newPost redirects to / when rootScope.loggedIn is false
blogApp.controller('newPostController', ['$rootScope', '$location', function(rootScope, location){
    if(rootScope.loggedIn == false){
        location.path('/');
    }
}]);