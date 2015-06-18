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

  /**
   * This callback type is called `vehiclesCallback` and is displayed as a global symbol.
   *
   * @callback vehiclesCallback
   * @param {object} responseError
   * @param {Object[]} responseArray of vehicles
   */

  /**
   *
   * @param {Object|Object[]} queryParams - The query params
   * @param {vehiclesCallback} callback
   */
  identity: function (callback) {
    this._fleetlogRequest("GET", '/v2/me', null, function (error, results) {
      callback(error, results != null ? results.data : []);
    });
  },

  /**
   * This callback type is called `vehiclesCallback` and is displayed as a global symbol.
   *
   * @callback vehiclesCallback
   * @param {object} responseError
   * @param {Object[]} responseArray of vehicles
   */

  /**
   *
   * @param {Object|Object[]} queryParams - The query params
   * @param {vehiclesCallback} callback
   */
  getVehicles: function (queryParams, callback) {
    _queryString = qs.stringify(queryParams);
    if (_queryString.length > 0) {
      _queryString = '?' + _queryString;
    }
    this._fleetlogRequest("GET", '/v2/vehicles' + _queryString, null, function (error, results) {
      callback(error, results != null ? results.data : []);
    });
  },

  _fleetlogRequest: function (method, path, data, callback) {
    _requestMethod = (method || "GET").toUpperCase();

    _contentLength = data ? (JSON.stringify(data).length) : 0;
    _headers = {
      "Authorization": "Bearer " + this._api_access_token,
      "Content-Type": "application/json",
      "Content-Length": _contentLength
    };

    _requestBody = {
      method: _requestMethod,
      url: this._api_host + path,
      headers: _headers
    };

    if (data != null) {
      _requestBody.formData = data;
    }

    return request(_requestBody, function (err, result, body) {
      if (result.statusCode == 401) {
        return callback(UNAUTHORIZED)
      } // TODO: Error handling

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

