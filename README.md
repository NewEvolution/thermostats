# Thermostats
A [NodeJS](https://nodejs.org/) API serving user provided home thermostat setting statistics from [PostgreSQL](https://www.postgresql.org/) to an [AngularJS](https://angularjs.org/) front end, with [SmartyStreets](https://smartystreets.com/) ZIP Code lookups and [jVectorMap](http://jvectormap.com/) data visualization.

![thermostats screenshot](https://raw.githubusercontent.com/NewEvolution/thermostats/master/thermostats_screenshot.png)

## About
This app was written out of curiosity about people's heating and cooling habits and a desire to work with map-based informational display.

## Installation & Execution
- Install [NodeJS](https://nodejs.org)
- Install [PostgreSQL](https://www.postgresql.org/download/)
- Sign up for a free [SmartyStreets API access](https://smartystreets.com/signup)
- [Start PostgreSQL](https://www.postgresql.org/docs/9.1/static/server-start.html)
- Clone down this repository
- In a terminal within the repository directory:
  - Set your SmartyStreets Secret Keys as [environment variables](https://www.google.com/search?q=setting+environment+variables)
    - Your key's Auth ID as `AUTHID`
    - Your key's Auth Token as `AUTHTOKEN`
  - Install required Node modules by running `npm install`
  - Install required Bower components by running `./node_modules/.bin/bower install`
  - Generate the jVectorMap script by running `./public/vendor/jvectormap/build.sh`
  - Install the jVectorMap script by running `mv jquery.jvectormap.min.js public/vendor/jvectormap/`
  - Start the server by running `node server.js`

## Usage
- In the browser of your choice, go to [`http://localhost:3000`](http://localhost:3000).
- Click any state on the map to open the data entry modal window.
- Radio buttons at the bottom of the page switch display between heating and cooling values.
- States will change their color values based on the relative average heating and cooling values.
- Mousing over a state which has data will display the average heating and cooling values.
