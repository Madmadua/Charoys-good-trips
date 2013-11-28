'use strict';

/* Controllers */

var cgtControllers = angular.module('cgtControllers', []);

cgtControllers.controller('cgtCtrl', ['$scope', '$http',
	function($scope, $http) {
		

		$scope.search = function() {
			$http.post('/proxy', {'url': 'http://api.outpost.travel/placeRentals?city=' + $scope.search_location}).success(function(data) {
				$scope.items = data.items.splice(0,5);
				/*$scope.items.forEach(function(item) {
			      alert(item);
			      item.latLng = item.latLng.replace('[', "(");
			    });*/
			});
		};
	}
]);
