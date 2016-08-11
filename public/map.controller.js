'use strict';
angular.module('Thermostats').controller('mapCtrl', function ($http) { // eslint-disable-line prefer-arrow-callback

  const mapCtrl = this;
  mapCtrl.zip = '';
  mapCtrl.heat = '';
  mapCtrl.cool = '';
  mapCtrl.noheat = false;
  mapCtrl.nocool = false;
  mapCtrl.show = 'heat';

  function loadmap () {
    $http.get('/api/summary')
    .then(response => {
      const rawtemps = response.data;
      const heat = {};
      const cool = {};
      rawtemps.forEach(temp => {
        heat[`US-${temp.abbr}`] = temp.data.heat;
        cool[`US-${temp.abbr}`] = temp.data.cool;
      })
      $('#map').vectorMap({
        map: 'us_lcc_en',
        series: {
          regions: [{
            values: heat,
            scale: ['#ffdddd', '#ff0000'],
          }]
        },
        onRegionTipShow: (e, label, code) => {
          const h_data = heat[code];
          const c_data = cool[code];
          if (h_data && c_data) {
            label.html(`${label.html()}<br>Heat - ${h_data}&deg;<br>Cool - ${c_data}&deg;`);
          }
        }
      });

      const mapObject = $('#map').vectorMap('get', 'mapObject');

      mapCtrl.swap = () => {
        if (mapCtrl.show === 'heat') {
          mapObject.series.regions[0].setValues(heat);
          mapObject.series.regions[0].setScale(['#ffdddd', '#ff0000']);
        } else {
          mapObject.series.regions[0].setValues(cool);
          mapObject.series.regions[0].setScale(['#0000ff', '#ddddff']);
        }
      }
    });
  }

  loadmap();

  mapCtrl.send = () => {
    $http.post('/api', {
      zip: mapCtrl.zip,
      heat: mapCtrl.heat,
      cool: mapCtrl.cool,
      noheat: mapCtrl.noheat,
      nocool: mapCtrl.nocool
    })
    .then(succResp => {
      console.log('Post success:', succResp); // eslint-disable-line no-console
      loadmap();
    }, failResp => {
      console.log('Post failure:', failResp); // eslint-disable-line no-console
    });
  };
});
