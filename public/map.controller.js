'use strict';
angular.module('Thermostats').controller('mapCtrl', ['$http', function ($http) { // eslint-disable-line prefer-arrow-callback

  this.zip = '';
  this.heat = '';
  this.cool = '';
  this.noheat = false;
  this.nocool = false;
  this.show = 'heat';

  this.send = () => {
    $http.post('/api', {
      zip: this.zip,
      heat: this.heat,
      cool: this.cool,
      noheat: this.noheat,
      nocool: this.nocool
    })
    .then(succResp => {
      console.log('Post success:', succResp); // eslint-disable-line no-console
    }, failResp => {
      console.log('Post failure:', failResp); // eslint-disable-line no-console
    });
  };

  $http.get('/api/summary')
  .then(response => {
    const rawtemps = response.data;
    const heat = {};
    const cool = {};
    rawtemps.forEach(temp => {
      heat[`US-${temp.abbr}`] = temp.data.heat;
      cool[`US-${temp.abbr}`] = temp.data.cool;
    })
    $(() => {
      const map = new jvm.MultiMap({ // eslint-disable-line no-new,no-unused-vars
        container: $('#map'),
        maxLevel: 1,
        main: {
          map: 'us_lcc_en',
          series: {
            regions: [{
              values: heat,
              scale: ['#ffdddd', '#ff0000']
            }]
          },
          onRegionTipShow: (e, label, code) => {
            const data = heat[code];
            if (data) {
              label.html(`${label.html()}: Heat - ${data}`);
            }
          }
        },
        mapUrlByCode: (code, multiMap) => `/vendor/jvectormap/tests/assets/us/jquery-jvectormap-data-${code.toLowerCase()}-${multiMap.defaultProjection}-en.js`
      });

      this.swap = () => {
        if (this.show === 'heat') {
          map.params.main.series.regions[0].values = heat;
          map.params.main.series.regions[0].scale = ['#ffdddd', '#ff0000'];
        } else {
          map.params.main.series.regions[0].values = cool;
          map.params.main.series.regions[0].scale = ['#ddddff', '#0000ff'];
        }
      }
    });
  });
}]);
