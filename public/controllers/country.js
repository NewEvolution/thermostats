/* eslint strict:0, prefer-arrow-callback:0, no-console:0 */

app.controller('CountryCtrl', ['$http', function ($http) {

  this.zip = '';
  this.heat = '';
  this.cool = '';
  this.noheat = false;
  this.nocool = false;

  this.send = function () {
    $http.post('/api', {
      zip: this.zip,
      heat: this.heat,
      cool: this.cool,
      noheat: this.noheat,
      nocool: this.nocool
    })
    .then(function (succResp) {
      console.log('Success!: ', succResp);
    }, function (failResp) {
      console.log('Failure!: ', failResp);
    });
  }

  this.temps = [];

  $(function () {
    new jvm.MultiMap({ // eslint-disable-line no-new
      container: $('#map'),
      maxLevel: 1,
      main: {
        map: 'us_lcc_en'
      },
      mapUrlByCode: function (code, multiMap) {
        return '/vendor/jvectormap/tests/assets/us/jquery-jvectormap-data-' +
               code.toLowerCase() + '-' +
               multiMap.defaultProjection + '-en.js';
      }
    });
  });

  $http.get('/api')
  .then(function (response) {
    this.temps = response.data;
    console.log('this.temps: ', this.temps);
  });
}]);
