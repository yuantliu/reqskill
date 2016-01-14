var api = require('./../rest/get_blogapi.js');

module.exports = function(app){
    app.get('/api', function(req, res){
        api.getEntry(res);
    });
};