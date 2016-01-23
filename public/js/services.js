//use REST API to get blog entries
blogApp.service('mainBlogService', ['$location', '$resource',
    function (location, resource) {
	
        //return all entries
        this.get = function () {
            var url = api.blogGet;
            var blogJSON = resource(url);

            return blogJSON.get();
        };
    }
]);
