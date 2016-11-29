'use strict';
angular.module('Thermostats').controller('mapCtrl', function ($http) { // eslint-disable-line prefer-arrow-callback

  const mapCtrl = this;
  mapCtrl.zip = '';
  mapCtrl.heat = 60;
  mapCtrl.cool = 60;
  mapCtrl.noheat = false;
  mapCtrl.nocool = false;
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
          min: 40,
          max: 80
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
          label.html(`${label.html()}<br>Avg Heat - ${h_data}&deg;<br>Avg Cool - ${c_data}&deg;`);
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
    if (mapCtrl.show === 'heat') {
      mapData.mapObject.series.regions[0].setValues(mapData.mapTemps.heat);
      mapData.mapObject.series.regions[0].setScale(['#ffeded', '#ff0000']);
    } else {
      mapData.mapObject.series.regions[0].setValues(mapData.mapTemps.cool);
      mapData.mapObject.series.regions[0].setScale(['#0000ff', '#ededff']);
    }
  }

	// Clears form data
  mapCtrl.clear = () => {
    mapCtrl.zip = '';
    mapCtrl.heat = mapCtrl.cool = 60;
    mapCtrl.noheat = mapCtrl.nocool = null;
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
      if (succResp.data.message !== 'Invalid ZIP Code.') {
        retrieveData().then(temps => {
          mapData.mapTemps = temps;
          mapCtrl.swap();
        });
        mapCtrl.clear();
      } else {
        console.log(`That's not a valid zip code.`) // eslint-disable-line no-console
      }
      console.log('Post success:', succResp); // eslint-disable-line no-console
    }, failResp => {
      console.log('Post failure:', failResp); // eslint-disable-line no-console
    });
  };
});
