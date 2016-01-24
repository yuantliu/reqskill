//Blog home controller

//Take the RESTful query from blog service and populate blog.html
blogApp.controller('blogController', ['$scope', '$location', 'mainBlogService', function (scope, $location, blogService) {
	console.log("Main page");
	//want to use the mainBlogService to get all the entries and populate the main page
    scope.entries = blogService.get();
    
}]);

//
blogApp.controller('newPostController', ['$scope', function(scope){
    console.log("In post page");
}]);

//topbar controller
//parse cookies: if username and password are incorrect, wipe cookie, say "Login"
//otherwise: say "New Post"
blogApp.controller('topBarLoginController', ['$scope', '$cookies', function(scope, cookie){
    scope.login_text = "Login in here!";
}]);