/* eslint strict:0, prefer-arrow-callback:0, no-console:0 */

app.controller('SubmitCtrl', ['$http', function ($http) { // eslint-disable-line no-undef

  this.send = function () {
    $http.post('/api', {
      heat: this.heat,
      cool: this.cool,
      noheat: this.noheat,
      nocool: this.nocool,
      zip: this.zip
    })
    .then(function (succResp) {
      console.log('Success!: ', succResp);
    },
      function (failResp) {
        console.log('Failure!: ', failResp);
      }
    );
  }
}]);
