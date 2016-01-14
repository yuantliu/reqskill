//Blog home controller
blogApp.controller('blogController', ['$scope', '$location', function (scope, $location) {
	
	//host of blog API will be the same as the blog for now
	scope.host = $location.host() + ":" + $location.port();
	
	//want to use the mainBlogService to get all the entries and populate the main page
	
	
}]);