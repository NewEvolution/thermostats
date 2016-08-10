'use strict';
angular.module('Thermostats').controller('mapCtrl', function ($http) { // eslint-disable-line prefer-arrow-callback

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
          label.html(`${label.html()}:<br>Heat - ${h_data}&deg;<br>Cool - ${c_data}&deg;`);
        }
      }
    });

    const mapObject = $('#map').vectorMap('get', 'mapObject');

    this.swap = () => {
      if (this.show === 'heat') {
        mapObject.series.regions[0].setValues(heat);
        mapObject.series.regions[0].setScale(['#ffdddd', '#ff0000']);
      } else {
        mapObject.series.regions[0].setValues(cool);
        mapObject.series.regions[0].setScale(['#ddddff', '#0000ff']);
      }
    }
  });
});
