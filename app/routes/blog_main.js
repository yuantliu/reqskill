var api = require('./../rest/blogapi.js');
var path = require('path');

module.exports = function(app){
    
    app.get('/blog', function(req, res){
        res.sendFile(path.join(__dirname + '../../../public/html/main.html'));
    });
    
    //REST API for blog entries
    app.get('/blog/api', function(req, res){
        api.getEntry(res);
    });
    
    app.post('/blog/api', function(req, res){
        api.postEntry(req, res);
    });
    
    
};