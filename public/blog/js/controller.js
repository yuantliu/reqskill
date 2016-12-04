//Blog home controller

//listen for route's onchange events and execute validation from service before route change
blogApp.run(['$rootScope', 'validateCookieService', function (rootScope, validateCookieService) {
    rootScope.$on('$routeChangeSuccess', function () {
        validateCookieService.get();
    })
}]);

//app's root controller
//watches for rootscope's login status
blogApp.controller('topBarLoginController', ['$scope', '$cookies', '$rootScope', 'validateCookieService', function (scope, cookies, rootScope, validateCookieService) {    
    //need to have loggedIn stored in rootScope so that blogApp.run will be able to access it.
    rootScope.loggedIn = false;

    rootScope.$watch('loggedIn', function () {
        if (rootScope.loggedIn == true) {
            scope.link_text = "New Post";
            scope.post_link = "#newPost"
        } else {
            scope.link_text = "Login here";
            scope.post_link = "#login";
        }
    });

    rootScope.logout = function () { 
        cookies.remove('user');
        cookies.remove('pw');
        rootScope.loggedIn = false;
    };
    
    rootScope.hello = "Hallo!";
    
}]);

//Get entries from REST API
blogApp.controller('blogController', ['$scope', '$location', 'mainBlogService', function (scope, location, blogService) {
    //get entries from REST
    scope.entries = blogService.get();
    
    //function for deleting a post given an _id
    scope.delete = function (_id) {
        blogService.delete(_id,
            function (response) {
                //get entries again from REST
                if(response.success){ scope.entries = blogService.get(); }
                    
            },
            function () {
                console.log("Failed to delete entry");
            }
        );
    }
}]);
//newPost redirects to / when rootScope.loggedIn is false
blogApp.controller('newPostController', ['$rootScope', '$location', function (rootScope, location) {
    if (rootScope.loggedIn == false) {
        location.path('/');
    }
}]);