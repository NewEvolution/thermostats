/* eslint strict:0 */
var app = angular.module('Thermostats', ['ngRoute']); // eslint-disable-line no-undef

app.config(['$routeProvider', function ($routeProvider) {
  $routeProvider
    .when('/country', {
      templateUrl: 'partials/country.html',
      controller: 'CountryCtrl'
    })
    .when('/state/:abbr', {
      templateUrl: 'partials/state.html',
      controller: 'StateCtrl'
    })
    .when('/area/:zip', {
      templateUrl: 'partials/area.html',
      controller: 'AreaCtrl'
    })
    .otherwise('/country');
}]);
