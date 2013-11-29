'use strict';

/* Controllers */

var cgtControllers = angular.module('cgtControllers' , []);

cgtControllers.controller('cgtCtrl', ['$scope', '$http',
	function($scope, $http) {
		

	    $scope.search = function() {

	    	/*$scope.room.trips.push({
	    		city : $scope.search_location,
	    		acomodations : [],
	    		transports : []
	    	})*/
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
	    	
			$http.post('/proxy', {'url': 'http://api.outpost.travel/placeRentals?city=' + str}).success(function(data) {
				


				/*var acom = $scope.room.trips[0].acomodations;

				acom.splice( 0 , acom.length )

				for( var i=Math.min( 5 , data.items.length );i--;){
					var item = data.items[i];
					acom.unshift({
						latLng : item.latLng,
						photo : item.photos[0].url,
						heading : item.heading,
						wifi : item.amenities.indexOf('wifi') >= 0,
						parking : item.amenities.indexOf('parking') >= 0,
						link : item.link,
						price : item.price
					})
				}*/
				/*$scope.index=0;
				data.items.forEach(function(item){
					if($scope.index < 5){
						alert(item.occupancy+' '+$scope.search_nb_guests.selected);
						if(item.occupancy == $scope.search_nb_guests){
							$scope.items[$scope.index] = item;
							$scope.index++;
						}
						else{
							if($scope.search_nb_guests == 3){
								if(item.occupancy >= $scope.search_nb_guests){
									$scope.items[$scope.index] = item;
									$scope.index++;
								}
							}
						}
					}
				});*/
				$scope.items = data.items.splice(0,5);

				/*$scope.items.forEach(function(item) {
			      alert(item);
			      item.latLng = item.latLng.replace('[', "(");
			    });*/
			});
		};
		
		$scope.details_velo = false;
		$scope.details_voiture = false;
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

			save:function( self , all ){
				var url = $scope.url()
				$http({ data : all ? self : $scope.parse(self) , method: 'PUT', url: url })
				.success(function(data, status, headers, config) {
					op.hydrate( self , data )
				})
				return this;
			},
		}

		$scope.op = op;

		$scope.parse=function(x){
			return x;
		}
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

		$scope.parse = function( room ){
			var p =[ 'name' ],o={};
			for(var i=p.length;i--;)
				o[ p[i] ]= room[ p[i] ]
			return o;
		}
	}
]);

cgtControllers.controller('roomCtrl', ['$scope','$http',
	function($scope,$http) {

		var op = $scope.op;

		$scope.label = "room"

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

		$scope.parse = function( room ){
			var p =[ 'name','date','city' ],o={};
			for(var i=p.length;i--;)
				o[ p[i] ]= room[ p[i] ]
			return o;
		}
	}
]);

cgtControllers.controller('acomodationCtrl', ['$scope','$http',
	function($scope,$http) {

		$scope.label = "acomodation"

		var op = $scope.op;

		$scope.url = function(){
			return "/groups/"+( $scope.room.hash ) +"/trips/"+$scope.trip.id+"/acomodations"+( $scope.acomodation.id ? '/'+$scope.acomodation.id : '' )
		}

		$scope.parse = function( room ){
			var p =[ 'name','date','city' ],o={};
			for(var i=p.length;i--;)
				o[ p[i] ]= room[ p[i] ]
			return o;
		}
	}
]);

cgtControllers.controller('tripCtrl', ['$scope','$http',
	function($scope,$http) {

		$scope.label = "trip"

		var op = $scope.op;

		$scope.url = function(){
			return "/groups/"+( $scope.room.hash ) +"/trips/"+( $scope.trip.id ? '/'+$scope.trip.id : '' )
		}
	}
]);
