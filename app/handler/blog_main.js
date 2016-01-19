var api = require('./../rest/blogapi.js');

module.exports = function(app){
    app.get('/blog/api', function(req, res){
        api.getEntry(res);
    });
    
    app.post('/newpost', function(req, res){
        api.postEntry(req, res);
    });
};