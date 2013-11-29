'use strict';

/* App Module */

var cgtApp = angular.module('cgtApp', [
    'ngRoute',
    'cgtServices',
    'cgtControllers'
]);


/*
cgtApp.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.
        when('/search', {
            templateUrl: 'partials/search.html',
            controller: 'SearchCtrl'
        }).
  
        when('/phones/:phoneId', {
            templateUrl: 'partials/phone-detail.html',
            controller: 'PhoneDetailCtrl'
        }).
        otherwise({
            redirectTo: '/'
        });
    }
]);

*/