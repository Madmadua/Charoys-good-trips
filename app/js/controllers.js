'use strict';

/* Controllers */

var cgtControllers = angular.module('cgtControllers', []);

cgtControllers.controller('cgtCtrl', ['$scope', '$http', 
	function($scope, $http) {


		
	    $http({method: 'GET', url: 'items.json'}).
	    success(function(data, status, headers, config) {
	    	console.log(data);

	    }).
	    error(function(data, status, headers, config) {
	    	console.log(data);
	    	console.log(status);
	    	console.log(headers);
	    	console.log(config);
	    });


	}
]);
