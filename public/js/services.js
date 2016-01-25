//use REST API to get blog entries
blogApp.service('mainBlogService', ['$resource', 'urlService', function (resource, url) {
	
        //return all entries
        this.get = function () {
            var blogJSON = resource(url.blogGet);
            return blogJSON.get();
        };
    }
]);

//validate user login cookies
//change rootScope variable to reflect this
blogApp.service('validateCookieService', ['$rootScope', '$cookies', '$resource', 'urlService', function (rootScope, cookies, resource, url) {
    this.get = function () {
        //read cookies
        console.log("Service Here");
        var user = cookies.get('user');
        var pw = cookies.get('pw');
		
        //if no cookies, just immediately return false
        if (user == null || pw == null || user == '' || pw == '') {
            rootScope.loggedIn = false;
            return;
        }

        var status = resource(url.userGet + "?user=" + user + "&pw=" + pw).get(function () {
            if (status.status == true)
                rootScope.loggedIn = true;
            else
                rootScope.loggedIn = false;
        });
    }
}]);

//URL variables stored here
blogApp.service('urlService', function(){
    this.blogGet = '/blog/api';
    this.userGet = '/blog/auth';
});