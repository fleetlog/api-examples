var qs = require('querystring');
var request = require('request');


module.exports = Fleetlog;

UNAUTHORIZED = 'unauthorized';

function Fleetlog() {
  this._client_id = null;
  this._client_secret = null;
}

Fleetlog.prototype = {
  //_api_host: 'https://api.fleetlog.com.au',
  _api_host: 'http://localhost:3000',
  _api_access_token: null,
  _api_refresh_token: null,

  setAccessToken: function (token) {
    this._api_access_token = token;
  },

  identity: function (callback) {
    this._fleetlogRequest("GET", '/v2/me', null, callback);
  },

  _fleetlogRequest: function (method, path, data, callback) {
    return request.get({ url: this._api_host+'/v2/me', headers: {Authorization: "Bearer "+this._api_access_token}}, function(err, result, body) {
      if (result.statusCode == 401) { return callback(UNAUTHORIZED)} // TODO: Refresh token

      var bodyObj;
      try {
        bodyObj = JSON.parse(body);
      } catch (_error) {
        console.log(_error);
        return;
      }
      return typeof callback === "function" ? callback(err, bodyObj) : void 0;
    })
  }
};

