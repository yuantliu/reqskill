//Directive for each individual blog entry
blogApp.directive('blogEntry', function () {
    return {
        templateUrl: '/public/blog/html/blog-entry.html',
        restrict: 'AE',
        scope: {
            //make entry object available
            entry: '=',
            //make delete function available
            delete: '&'
        },
        controller: function ($scope, $rootScope) {
            $rootScope.$watch('loggedIn', function () {
                $scope.loggedIn = $rootScope.loggedIn;
            });
        }
    }
});