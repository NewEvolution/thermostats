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
##### Full Site
- In the browser of your choice, go to [`http://localhost:3000`](http://localhost:3000).
- Click any state on the map to open the data entry modal window.
- Radio buttons at the bottom of the page switch display between heating and cooling values.
- States will change their color values based on the relative average heating and cooling values.
- Mousing over a state which has data will display the average heating and cooling values.
##### API
- [`http://localhost:3000/api`](http://localhost:3000/api) - same as `/api/detail`.
- [`http://localhost:3000/api/detail`](http://localhost:3000/api/detail) - full listing of all data.
- [`http://localhost:3000/api/detail/<state>`](http://localhost:3000/api/detail/tn) - full listing of all data for the `<state>` provided as the state's 2-letter abbreviation.
- [`http://localhost:3000/api/detail/<state>/<county>`](http://localhost:3000/api/detail/tn/rutherford) - full listing of all data for the `<county>` provided by name in the `<state>` provided by 2-letter abbreviation.
- [`http://localhost:3000/api/summary`](http://localhost:3000/api/summary) - listing of data summarized by state for all states in the database.
- [`http://localhost:3000/api/summary/<state>`](http://localhost:3000/api/summary/tn) - listing of data summary for the `<state>` provided by 2-letter abbreviation.
- [`http://localhost:3000/api/summary/<state>/<county>`](http://localhost:3000/api/summary/tn/rutherford) - listing of data summary for all entries for the `<county>` provided by name in the `<state>` provided by 2-letter abbreviation.
