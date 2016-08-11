'use strict';
angular.module('Thermostats').controller('mapCtrl', function ($http) { // eslint-disable-line prefer-arrow-callback

  const mapCtrl = this;
  mapCtrl.zip = '';
  mapCtrl.heat = '';
  mapCtrl.cool = '';
  mapCtrl.noheat = false;
  mapCtrl.nocool = false;
  mapCtrl.show = 'heat';

  function retrieveData () {
    return $http.get('/api/summary')
    .then(response => {
      const rawtemps = response.data;
      const temps = {
        heat: {},
        cool: {}
      };
      rawtemps.forEach(temp => {
        temps.heat[`US-${temp.abbr}`] = temp.data.heat;
        temps.cool[`US-${temp.abbr}`] = temp.data.cool;
      })
      return temps;
    });
  }

  function buildMap (temps) {
    $('#map').vectorMap({
      map: 'us_lcc_en',
      series: {
        regions: [{
          values: temps.heat,
          scale: ['#ffeded', '#ff0000'],
          min: 40,
          max: 80
        }]
      },
      onRegionClick: () => {
        $('#input-modal').modal();
      },
      onRegionTipShow: (e, label, code) => {
        const h_data = temps.heat[code];
        const c_data = temps.cool[code];
        if (h_data && c_data) {
          label.html(`${label.html()}<br>Heat - ${h_data}&deg;<br>Cool - ${c_data}&deg;`);
        }
      }
    });
    const mapObject = $('#map').vectorMap('get', 'mapObject');
    return mapObject;
  }

  let mapData;
  retrieveData().then(temps => {
    const promisedData = {
      mapObject: buildMap(temps),
      mapTemps: temps
    }
    return promisedData;
  }).then(promisedData => { mapData = promisedData });


  mapCtrl.swap = () => {
    if (mapCtrl.show === 'heat') {
      mapData.mapObject.series.regions[0].setValues(mapData.mapTemps.heat);
      mapData.mapObject.series.regions[0].setScale(['#ffeded', '#ff0000']);
    } else {
      mapData.mapObject.series.regions[0].setValues(mapData.mapTemps.cool);
      mapData.mapObject.series.regions[0].setScale(['#0000ff', '#ededff']);
    }
  }

  mapCtrl.send = () => {
    $http.post('/api', {
      zip: mapCtrl.zip,
      heat: mapCtrl.heat,
      cool: mapCtrl.cool,
      noheat: mapCtrl.noheat,
      nocool: mapCtrl.nocool
    })
    .then(succResp => {
      if (succResp.data.message !== 'Invalid ZIP Code.') {
        retrieveData().then(temps => {
          mapData.mapTemps = temps;
          mapCtrl.swap();
        });
        mapCtrl.heat = mapCtrl.cool = mapCtrl.zip = '';
        mapCtrl.noheat = mapCtrl.nocool = null;
      } else {
        console.log(`That's not a valid zip code.`) // eslint-disable-line no-console
      }
      console.log('Post success:', succResp); // eslint-disable-line no-console
    }, failResp => {
      console.log('Post failure:', failResp); // eslint-disable-line no-console
    });
  };
});
