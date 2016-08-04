'use strict';

/**
 * @ngdoc function
 * @name careersYeomanApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the careersYeomanApp
 */
angular.module('careersYeomanApp')
  .controller('MainCtrl', function ($http, $scope, $timeout) {
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];


    var file = '';
    var encoded_data = '';
    $scope.ifMessage = false;
    $scope.message = '';
    $scope.active = true;
    $scope.positions = '';
    $scope.user = {};
    $scope.arrow = true;
    $scope.showArrows = '';
    $scope.expanded = false;
    $scope.check_status = false;

    // Populate all the open positions from recruiterbox 
   	function fetchPositions() {
   		var dataArray = [];
   		$http({
			method : 'GET',
			url : 'https://jsapi.recruiterbox.com/v1/openings?client_name=keastone'
		})
		.success(function (data, status, headers, config) {
			console.log(data);
			// data.objects.forEach(function (record) {
			// 	// console.log(record);
			// 	var str = record.description;
			// 	// console.log(str);
			// 	var index = str.indexOf('2016!')+5;
			//     // var index = str.substring(str.indexOf('IRIIIS will be'), str.indexOf('2016!'));
			//     // console.log(str.substr(c));
			//     record.description = str.substr(index);
			//     // console.log(record);
			//     dataArray.push(record);
			//     console.log(dataArray);

			// });
			$scope.positions = data.objects;
			// $scope.positions = dataArray;
		})
		.error(function (data, status, headers, config) {
			console.log(data);
		});
   	}


   fetchPositions();

   	$scope.uploadFile = function(event){
        var reader = new FileReader();
        var str = '';

        reader.onload = function(readerEvt) {
	        str = readerEvt.target.result;
	        // str will have the base64 encoded data, have to strip off 'data/application;base64,'
	        str = str.substring(str.indexOf(",") + 1);
	        console.log(str);
	        encoded_data = str;
        };

        file = event.target.files;
        reader.readAsDataURL(file[0]);
    };


   $scope.toggleAccordion = function () {
   		this.active = !this.active;
   		console.log(this.active);
   		// Expand the section
   		if(this.active === false) {
   			this.expanded = true;
   			this.showArrows = false;
   		}
   		// Shrink the section
   		else {
   			this.expanded = false;
   			this.showArrows = true;
   		}
   }

   $scope.showArrow = function () {
   	// If already expanded, then show the up arrow
   	if(this.active === false) {
   		this.showArrows = false;
   		this.expanded = true;
   	}
   	// Not expanded, show the down arrow
   	else {
   		this.showArrows = true;
   		this.expanded = false;
   	}
   	// this.showArrows = true;
   	console.log('here');
   }

   // Hide all arrows
    $scope.hideArrow = function () {
	   	this.showArrows = false;
	   	this.expanded = false;
	}


   // Submit the application by passing the date to recruiter box
   $scope.apply = function (jobId) {

   		this.check_status = true;

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
			url: 'https://jsapi.recruiterbox.com/v1/openings/'+jobId+'/apply?client_name=keastone',
			data: JSON.stringify(payload),
			dataType: 'json',
			contentType: 'application/json'
		})
		.success(function (data, status, headers, config) {
			console.log(status);
			if(status == 201) {
				$scope.ifMessage = true;
				$scope.message = "Thank you for applying";
				$timeout(function () {
					$scope.ifMessage = false;
					$scope.message = "";
				}, 3000);
			}
			else {
				$scope.ifMessage = true;
				$scope.message = "Error! Please try again!";
				this.check_status = false;
				$timeout(function () {
					$scope.ifMessage = false;
					$scope.message = "";
				}, 3000);
			}
		})
		.error(function (data, status, headers, config) {
			console.log(status);
			$scope.ifMessage = true;
			$scope.message = "Error! Please try again!";
			this.check_status = false;
			$timeout(function () {
				$scope.ifMessage = false;
				$scope.message = "";
			}, 3000);
		});
   }	


    
  });
