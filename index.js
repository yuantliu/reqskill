var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser')

var app = express();
var port = process.env.PORT || 3000;


//middlewares for express

//body parser
app.use(bodyParser.urlencoded({extended: false}));
//cookie parser
app.use(cookieParser());
//app.use(express.cookieParser());
//static files
app.use('/public', express.static(__dirname + '/public'));


//routes
var blogapi = require('./app/routes/blog_route');
blogapi(app);


app.listen(port, function(err){
    if(!err)
        console.log(`App listening on port ${port}`);
    else
        console.log(`Error starting application`);
});