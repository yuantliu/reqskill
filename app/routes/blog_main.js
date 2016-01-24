var domain = require('./../domain/variables');
var blogApi = require('./../rest/blogapi');
var userApi = require('./../rest/userapi');

var client = require('request-json').createClient(domain.domain);


module.exports = function(app){
    
    app.get('/blog', function(req, res){
        res.sendFile(path.join(__dirname + '../../../public/html/main.html'));
    });
    
    //retrieve blog entries
	
	//have to pass in res for api to send response back for now due to asynchronous function issues
    app.get('/blog/api', function(req, res){
        blogApi.getEntry(res);
    });
    
    app.post('/blog/api', function(req, res){
        //get and validate cookies first
        var user = req.cookies.user;
        var pw = req.cookies.pw;
        /*client.get(domain.domain + '/blog/cookie?user=' + user + '%26pw=' + pw, function(error, resp, body){
            var resp = JSON.stringify(body);
            console.log('----------------');
            console.log(body);
            //bad credentials in cookies
            if(error != null || resp.status != 1){
                res.redirect('/blog');
            } else {
                
            }
        });*/
		blogApi.postEntry(req, res);
		res.redirect('/blog');
    });
    
    
	//login check
	//login?user=u&pw=p&hashed=0
    app.get('/blog/auth', function(req, res){
		var user = req.query.user;
		var password = req.query.pw;
		var hashed = req.query.hashed;
		
		userApi.validateLogin(res, user, password, hashed);
	});
    
};