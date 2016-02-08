//REST interfaces
blogApp.service('mainBlogService', ['$resource', 'urlService', function (resource, url) {
        //return all entries
        this.get = function () {
            var getResource = resource(url.blog);
            return getResource.get();
        };
        
        //delete an entry given an id
        this.delete = function(id, successCallback, failureCallback){
            var deleteResource = resource(url.blog + "/:entryId", {entryId: '@id'});
            return deleteResource.delete({entryId: id}, successCallback, failureCallback);
        }
    }
]);

//validate user login cookies
//change rootScope variable to reflect this
blogApp.service('validateCookieService', ['$rootScope', '$cookies', '$resource', 'urlService', function (rootScope, cookies, resource, url) {
    this.get = function () {
        //read cookies
        var user = cookies.get('user');
        var pw = cookies.get('pw');
		
        //if no cookies, just immediately return false
        if (user == null || pw == null || user == '' || pw == '') {
            rootScope.loggedIn = false;
            return;
        }

        var status = resource(url.user + "?user=" + user + "&pw=" + pw).get(function () {
            if (status.status == true)
                rootScope.loggedIn = true;
            else
                rootScope.loggedIn = false;
        });
    }
}]);

//URL variables stored here
blogApp.service('urlService', function(){
    this.blog = '/blog/api';
    this.user = '/blog/auth';
});