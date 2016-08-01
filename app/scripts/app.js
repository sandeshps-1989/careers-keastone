'use strict';

/**
 * @ngdoc overview
 * @name careersYeomanApp
 * @description
 * # careersYeomanApp
 *
 * Main module of the application.
 */
angular
  .module('careersYeomanApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch'
  ])

  .filter('renderAsHtml', ['$sce',function($sce) {
    return function(value) {
      return $sce.trustAsHtml(value);
    }
  }])

  .directive('customOnChange', function() {
    return {
      restrict: 'A',
      link: function (scope, element, attrs) {
        var onChangeHandler = scope.$eval(attrs.customOnChange);
        element.bind('change', onChangeHandler);
      }
    };
  })

  .filter('trimContent', function($sce) {
    return function (value){
      var str = value;
      var c = str.indexOf('<p><strong>ROLE DESCRIPTION :</strong></p>');
      console.log(str.substr(c));
      return str.substr(c);
    };
  })


  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl',
        controllerAs: 'about'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
