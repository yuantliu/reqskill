//static files in file system
var path = require('path');

module.exports = function(app){
    app.route('/').get(function(req, res){
        res.sendFile(path.join(__dirname + '/../../public/search/html/main.html'));
    });
}