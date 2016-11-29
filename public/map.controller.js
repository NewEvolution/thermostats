'use strict';
angular.module('Thermostats').controller('mapCtrl', function ($http) { // eslint-disable-line prefer-arrow-callback

  const mapCtrl = this;
  mapCtrl.zip = mapCtrl.error = '';
  mapCtrl.heat = mapCtrl.cool = 60;
  mapCtrl.noheat = mapCtrl.nocool = false;
  mapCtrl.show = 'heat';

	// Grabs whole country summary data from API
  const retrieveData = () => {
    return $http.get('/api/summary')
    .then(response => {
      const rawtemps = response.data,
            temps = {
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

	// Generates and populates map with initial data
  const buildMap = (temps) => {
    $('#map').vectorMap({
      map: 'us_lcc_en',
      backgroundColor: '#214244',
      series: {
        regions: [{
          values: temps.heat,
          scale: ['#ffeded', '#ff0000'],
          min: 30,
          max: 90
        }]
      },
      onRegionClick: (e, code) => { // eslint-disable-line no-unused-vars
				// console.log(code.slice(3)); // grabs state abbreviation
        $('#input-modal').modal();
      },
      onRegionTipShow: (e, label, code) => {
        const h_data = temps.heat[code],
              c_data = temps.cool[code];
        if (h_data && c_data) {
          label.html(`${label.html()}<br>Avg Heat - ${h_data}&deg;F<br>Avg Cool - ${c_data}&deg;F`);
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

  // Switches display of data between heating and cooling
	// also cross-purposed to update map data after form submission
  mapCtrl.swap = () => {
    const map = mapData.mapObject.series.regions[0];
    if (mapCtrl.show === 'heat') {
      map.setValues(mapData.mapTemps.heat);
      map.setScale(['#ffeded', '#ff0000']);
    } else {
      map.setValues(mapData.mapTemps.cool);
      map.setScale(['#0000ff', '#ededff']);
    }
  }

	// Clears form data
  mapCtrl.clear = () => {
    mapCtrl.zip = mapCtrl.error = '';
    mapCtrl.heat = mapCtrl.cool = 60;
    mapCtrl.noheat = mapCtrl.nocool = null;
    $('.error-block').collapse('hide');
  }

	// Submits form data for new temperature to the database
  mapCtrl.send = () => {
    $http.post('/api', {
      zip: mapCtrl.zip,
      heat: mapCtrl.heat,
      cool: mapCtrl.cool,
      noheat: mapCtrl.noheat,
      nocool: mapCtrl.nocool
    })
    .then(succResp => {
      const failMessages = [
        'Blank lookup (you must provide a ZIP Code and/or City/State combination).',
        'Invalid ZIP Code.'
      ];
      if (failMessages.includes(succResp.data.message)) {
        $('.error-block').collapse('show');
        mapCtrl.error = 'Please provide a valid ZIP Code.';
        mapCtrl.zip = '';
      } else {
        retrieveData().then(temps => {
          mapData.mapTemps = temps;
          mapCtrl.swap();
        });
        mapCtrl.clear();
        $('#input-modal').modal('hide');
      }
    }, failResp => {
      console.log('Post failure:', failResp); // eslint-disable-line no-console
    });
  };
});
