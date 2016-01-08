//Directive for each individual blog entry
//blog/entry/{{id}}
blogApp.directive('blogEntry', function(){
	return {
		templateUrl: 'html/blog-entry.html',
		restrict: 'AE',
		scope: {
			entry: '='
		}
	}
});