'use strict';

/**
 * @ngdoc function
 * @name careersYeomanApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the careersYeomanApp
 */
angular.module('careersYeomanApp')
  .controller('MainCtrl', function ($http, $scope, $base64) {
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];


    var file = '';
    var encoded_data = '';
    $scope.active = true;
    $scope.positions = '';
    $scope.user = {};

    // Populate all the open positions from recruiterbox 
   	function fetchPositions() {
   		$http({
			method : 'GET',
			url : 'https://jsapi.recruiterbox.com/v1/openings?client_name=keastone52485'
		})
		.success(function (data, status, headers, config) {
			console.log(data);
			$scope.positions = data.objects;
		})
		.error(function (data, status, headers, config) {
			console.log(data);
		});
   	}


   fetchPositions();

   	$scope.uploadFile = function(event){
        file = event.target.files;
        console.log(file[0]);
        var reader = new FileReader();

        // reader.onload = function(readerEvt) {
        // var binaryString = file[0];
        encoded_data = $base64.encode(reader.readAsText(file[0]));
        console.log(encoded_data);
        // console.log(file[0].readAsDataUrl());
        // };
    };

   // Submit the application by passing the date to recruiter box
   $scope.apply = function (jobId) {

   		var reader = new FileReader();

   		var payload = {
			"fields": [
				{ "key" : "candidate_first_name", "value" : $scope.user.firstname},
				{ "key" : "candidate_last_name", "value" : $scope.user.lastname},
				{ "key" : "candidate_email", "value" : $scope.user.email},
				{ "key" : "candidate_phone", "value" : $scope.user.contact},
				{ "key" : "resume", "value": {
				  "encoded_data" : encoded_data,
				  "file_name" : file[0].name
				  }
				}
			]
		};

		console.log(payload);

		$http({
			method : 'POST',
			url: 'https://jsapi.recruiterbox.com/v1/openings/'+jobId+'/apply?client_name=keastone52485',
			data: JSON.stringify(payload),
			dataType: 'json',
			contentType: 'application/json'
		})
		.success(function (data, status, headers, config) {
			console.log(data);
		})
		.error(function (data, status, headers, config) {
			console.log(data);
		});

   }	


    
  });
