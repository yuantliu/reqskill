var blogApp = angular.module('blogApp', ['ngRoute', 'ngResource']);

//store URLs
//this must be the same as routes in node
var api = {
    blogGet : "/blog/api"
};