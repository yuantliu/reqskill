//Directive for each individual blog entry
searchApp.directive('skillInfo', function () {
    return {
        templateUrl: '/public/search/html/skill-data.html',
        restrict: 'AE',
        scope: {
            //make the iterated skill data object (i) in ng-repeat available
            skill: '='
        }
    }
});