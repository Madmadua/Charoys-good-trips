'use strict';

/* Controllers */

var cgtControllers = angular.module('cgtControllers' , []);

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
		
		$scope.details=false;
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
