/* eslint strict:0 */
var app = angular.module('Thermostats', ['ngRoute']); // eslint-disable-line no-undef

app.config(['$routeProvider', function ($routeProvider) {
  $routeProvider
    .when('/', {
      templateUrl: 'partials/new.html',
      controller: 'SubmitCtrl',
      controllerAs: 'submit'
    })
    .when('/country', {
      templateUrl: 'partials/country.html',
      controller: 'CountryCtrl',
      controllerAs: 'country'
    })
    .when('/state/:abbr', {
      templateUrl: 'partials/state.html',
      controller: 'StateCtrl',
      controllerAs: 'state'
    })
    .when('/area/:zip', {
      templateUrl: 'partials/area.html',
      controller: 'AreaCtrl',
      controllerAs: 'area'
    })
    .otherwise('/');
}]);
