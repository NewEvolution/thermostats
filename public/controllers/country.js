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
      console.log('Post success: ', succResp);
    }, function (failResp) {
      console.log('Post failure: ', failResp);
    });
  }

  $http.get('/api/summary')
  .then(function (response) {
    var rawtemps = response.data;
    var temps = {};
    for (var i = rawtemps.length - 1; i >= 0; --i) { // eslint-disable-line no-magic-numbers
      temps['US-' + rawtemps[i].abbr] = rawtemps[i].data.heat;
    }
    console.log("temps", temps);
    $(function () {
      new jvm.MultiMap({ // eslint-disable-line no-new
        container: $('#map'),
        maxLevel: 1,
        main: {
          map: 'us_lcc_en',
          series: {
            regions: [{
              values: temps,
              scale: ['#500000', '#ff0000']
            }]
          },
          onRegionTipShow: function (e, el, name) {
            var heat = temps[name];
            if (heat) {
              el.html(el.html() + ': Heat - ' + heat);
            }
          }
        },
        mapUrlByCode: function (code, multiMap) {
          return '/vendor/jvectormap/tests/assets/us/jquery-jvectormap-data-' +
                 code.toLowerCase() + '-' +
                 multiMap.defaultProjection + '-en.js';
        }
      });
    });
  });
}]);
