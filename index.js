var express = require('express');
var app = express();

var port = process.env.PORT || 3000;

//routes
var blogapi = require('./app/handler/blogmain.js');
blogapi(app);

app.listen(port, function(err){
    if(!err)
        console.log(`App listening on port ${port}`);
    else
        console.log(`Error starting application`);
});