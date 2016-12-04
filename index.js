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

//static files for blog
app.use('/public/blog/', express.static(__dirname + '/public/blog/'));
//static files for search
app.use('/public/search/', express.static(__dirname + '/public/search/'));

//shared static files (front-end libs)
app.use('/public/lib/', express.static(__dirname + '/public/lib'));



//routes
var blogapi = require('./app/routes/blog_route');
blogapi(app);
var search = require('./app/routes/search');
search(app);
var appapi = require('./app/routes/app_route');
appapi(app);


app.listen(port, function(err){
    if(!err)
        console.log(`App listening on port ${port}`);
    else
        console.log(`Error starting application`);
});