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
   * This callback type is called `identityCallback` and is displayed as a global symbol.
   *
   * @callback identityCallback
   * @param {object} responseError
   * @param {Object} responseObject of user identity
   */

  /**
   *
   * @param {identityCallback} callback
   */
  identity: function (callback) {
    this._GETRequest('me', null, null, callback);
  },

  /**
   * This callback type is called `resourceCallback` and is displayed as a global symbol.
   *
   * @callback resourceCallback
   * @param {object} responseError
   * @param {Object[]} responseArray
   */

  /**
   *
   * @param {Object|Object[]} queryParams - The query params
   * @param {resourceCallback} callback
   */
  getVehicles: function (queryParams, callback) {
    this._GETRequest('vehicles', null, queryParams, callback);
  },


  /**
   *
   * @param {Object|Object[]} queryParams - The query params
   * @param {resourceCallback} callback
   */
  getTrips: function (queryParams, callback) {
    this._GETRequest('trips', null, queryParams, callback);
  },

  /**
   *
   * @param {Number} id - The trip id
   * @param {Object|Object[]} queryParams - The query params
   * @param {resourceCallback} callback
   */
  getTrip: function (id, queryParams, callback) {
    this._GETRequest('trips', id, queryParams, callback);
  },

  /**
   *
   * @param {Number} id - The vehicle id
   * @param {Object|Object[]} queryParams - The query params
   * @param {resourceCallback} callback
   */
  getVehicle: function (id, queryParams, callback) {
    this._GETRequest('vehicles', id, queryParams, callback);
  },


  /**
   *
   * @param {Object|Object[]} queryParams - The query params
   * @param {resourceCallback} callback
   */
  getCoordinates: function (queryParams, callback) {
    this._GETRequest('coordinates', null, queryParams, callback);
  },

  
  /**
   *
   * @param {number} tripId
   * @param {Object|Object[]} queryParams - The query params
   * @param {resourceCallback} callback
   */
  getCoordinates: function (tripId, queryParams, callback) {
    this._GETRequest('trips/'+tripId+'coordinates', null, queryParams, callback);
  },


  /**
   *
   * @param {string} resource - enum [cordinates, trips, vehicles, users]
   * @param {number} id
   * @param {Object|Object[]} queryParams - The query params
   * @param {resourceCallback} callback
   */
  _GETRequest: function (resource, id, queryParams, callback) {
    _queryString = qs.stringify(queryParams);
    if (_queryString.length > 0) {
      _queryString = '?' + _queryString;
    }

    var idQuery = id ? '/'+id : '';

    this._fleetlogRequest("GET", '/v2/'+ resource + idQuery + _queryString, null, function (error, results) {
      callback(error, results != null ? results.data : []);
    });
  },


  /**
   * This callback type is called `requestCallback` and is displayed as a global symbol.
   *
   * @callback requestCallback
   * @param {object|string} responseError
   * @param {Object[]} body
   */
  /**
   *
   * @param {string} method - GET, POST, PUT, PATCH
   * @param {string}  path
   * @param {object}  data
   * @param {requestCallback} callback
   * @private
   */
  _fleetlogRequest: function (method, path, data, callback) {
    _requestMethod = (method || "GET").toUpperCase();

    _contentLength = data ? (JSON.stringify(data).length) : 0;

    _headers = {
      "Authorization": "Bearer " + this._api_access_token,
      "Content-Type": "application/json",
      "Accept": "application/json",
      "User-Agent": 'Fleetlog/v2 Node/0.1', //TODO: actual package version
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
      return typeof callback === "function" ? callback(err, bodyObj) : null;
    })
  }
};

