'use strict';

/* Controllers */

var cgtControllers = angular.module('cgtControllers' , []);

cgtControllers.controller('cgtCtrl', ['$scope', '$http',
	function($scope, $http) {

	    $scope.search = function() {

	    	var str = $scope.search_location;

	    	if (str.indexOf('-') == -1) {
	    		var res = str.split(' ');

	    		str = '';

	    		for (var i = 0; i < res.length; i++) {
	    			str += res[i].charAt(0).toUpperCase() + res[i].slice(1) + ' ';
	    		}

	    		str = str.substring(0, str.length - 1);
	    	}
	    	else {
	    		str = str.charAt(0).toUpperCase() + str.slice(1);
	    	}

	    	// max_results = 5
	    	
			$http.post('/proxy', {'url': 'http://api.outpost.travel/placeRentals?city=' + str + '&occupancy=' + $scope.search_nb_guests}).success(function(data) {
				$scope.items = data.items.splice(0,5);
				/*$scope.items.forEach(function(item) {
			      alert(item);
			      item.latLng = item.latLng.replace('[', "(");
			    });*/
			});
		};
	}
]);




cgtControllers.controller('cRessource', ['$scope','$http',
	function($scope,$http) {


		$scope.room = {}

		/// operation
		var op = {

			hydrate : function( self , attrs ){
				for( var i in attrs )
					self[i]=attrs[i]
			},

			read:function( self , url ){
				$http({method: 'GET', url: url })
				.success(function(data, status, headers, config) {
					op.hydrate( self , data )
				})
			},

			save:function( self , url ){
				var that = this;
				$http({ data : self , method: 'PUT', url: url })
				.success(function(data, status, headers, config) {
					op.hydrate( self , data )
				})
				return this;
			},
		}

		$scope.op = op;
	}
]);


cgtControllers.controller('atriumCtrl', ['$scope',
	function($scope) {

		var op = $scope.op;

		$scope.hashRoom

		$scope.createRoom = function( name ){
			op.save(
				$scope.room,
				"/groups"
			)
		}

		$scope.readRoom = function( RoomHash ){
			op.read(
				$scope.room,
				"/groups/"+( RoomHash )
			)
		}
	}
]);

cgtControllers.controller('roomCtrl', ['$scope','$http',
	function($scope,$http) {

		var op = $scope.op;

		$scope.createTrip = function( name , city , date ){

			var trip = {
				'name':name,
				'city':city,
				'date':date
			}

			$scope.room.trips.push( trip )

			op.save(
				trip,
				"/groups/"+( $scope.room.hash )+"/trips"
			)
		}
		$scope.url = function(){
			return "/groups/"+( $scope.room.hash )
		}
	}
]);

cgtControllers.controller('tripCtrl', ['$scope','$http',
	function($scope,$http) {

		var op = $scope.op;

		$scope.url = function(){
			return "/groups/"+( $scope.room.hash ) +"/trips/"+$scope.trip.id
		}
	}
]);
