//use REST API to get blog entries
blogApp.service('mainBlogService', ['$location', '$resource',
    function (location, resource) {
	
        //return all entries
        this.get = function () {
            var url = "http://" + location.host() + ':' + location.port() + variables.blogURL;
            var blogJSON = resource(url);

            return blogJSON.get();
        };
    }
]);