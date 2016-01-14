//use REST API to get main page object
blogApp.service('mainBlogService', ['$resource', function(resource){
	
	//return all entries
	this.getEntries = function(){
		var weatherAPI = resource('http://api.openweathermap.org/data/2.5/forecast/daily', {
			callback: 'JSON_CALLBACK'
		}, {
			get: {
				method: 'JSONP'
			}
		});

		return weatherAPI.get({
			q: city,
			cnt: days,
			appid: 'd03b49657c870247d08717662554b5bc'
		});
	}
}]);