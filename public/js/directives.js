//Directive for each individual blog entry
blogApp.directive('blogEntry', function(){
	return {
		templateUrl: '../public/html/blog-entry.html',
		restrict: 'AE',
		scope: {
			entry: '='
		}
	}
});