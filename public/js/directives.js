//Directive for each individual blog entry
blogApp.directive('blogEntry', function(){
	return {
		templateUrl: '../html/blog-entry.html',
		restrict: 'AE',
		scope: {
			entry: '='
		}
	}
});