'use strict';

/* Controllers */

var cgtControllers = angular.module('cgtControllers', []);

cgtControllers.controller('cgtCtrl', ['$scope', '$http',
	function($scope, $http) {


		$http.post('/proxy', {'url': 'http://api.outpost.travel/placeRentals?city=Paris'}).success(function(data) {
			$scope.items = data.items.splice(0,5);
		});
		

	}
]);
