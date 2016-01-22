//Blog home controller

//Take the RESTful query from blog service and populate the 
blogApp.controller('blogController', ['$scope', '$location', 'mainBlogService', function (scope, $location, blogService) {
	
	//want to use the mainBlogService to get all the entries and populate the main page
    scope.entries = blogService.get();
    
}]);