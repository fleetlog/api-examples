var qs = require('querystring');
var request = require('request');


UNAUTHORIZED = 'unauthorized'; //TODO: error handling
BADREQUEST = 'badrequest';

var Fleetlog = {
  _api_host: process.env.NODE_ENV == 'dev' ? 'http://localhost:3000' : 'https://api.fleetlog.com.au', // BETA

  /**
   * This callback type is called `identityCallback` and is displayed as a global symbol.
   *
   * @callback identityCallback
   * @param {object} responseError
   * @param {Object} responseObject of user identity
   */

  /**
   *
   * @param {string} auth - Access Token
   * @param {identityCallback} callback
   */
  identity: function (auth, callback) {
    this._GETRequest(auth, 'me', null, null, callback);
  },

  /**
   * This callback type is called `resourceCallback` and is displayed as a global symbol.
   *
   * @callback resourceCallback
   * @param {string} auth - Access Token
   * @param {object} responseError
   * @param {Object[]} responseArray
   */

  /**
   *
   * @param {Object|Object[]} queryParams - The query params
   * @param {resourceCallback} callback
   */
  getVehicles: function (auth, queryParams, callback) {
    this._GETRequest(auth, 'vehicles', null, queryParams, callback);
  },


  /**
   *
   * @param {string} auth - Access Token
   * @param {Object|Object[]} queryParams - The query params
   * @param {resourceCallback} callback
   */
  getTrips: function (auth, queryParams, callback) {
    this._GETRequest(auth, 'trips', null, queryParams, callback);
  },


  /**
   *
   * @param {string} auth - Access Token
   * @param {Number} id - The trip id
   * @param {Object|Object[]} queryParams - The query params
   * @param {resourceCallback} callback
   */
  getTrip: function (auth, id, queryParams, callback) {
    this._GETRequest(auth, 'trips', id, queryParams, callback);
  },

  /**
   *
   * @param {string} auth - Access Token
   * @param {Number} id - The vehicle id
   * @param {Object|Object[]} queryParams - The query params
   * @param {resourceCallback} callback
   */
  getVehicle: function (auth, id, queryParams, callback) {
    this._GETRequest(auth, 'vehicles', id, queryParams, callback);
  },


  /**
   *
   * @param {string} auth - Access Token
   * @param {Object|Object[]} queryParams - The query params
   * @param {resourceCallback} callback
   */
  getCoordinates: function (auth, queryParams, callback) {
    this._GETRequest(auth, 'coordinates', null, queryParams, callback);
  },

  
  /**
   *
   * @param {string} auth - Access Token
   * @param {number} tripId
   * @param {Object|Object[]} queryParams - The query params
   * @param {resourceCallback} callback
   */
  getTripWithCoordinates: function (auth, tripId, queryParams, callback) {
    this._GETRequest(auth, 'trips/'+tripId+'/coordinates', null, queryParams, callback);
  },


  /**
   *
   * @param {string} auth - Access Token
   * @param {string} resource - enum [cordinates, trips, vehicles, users]
   * @param {number} id
   * @param {Object|Object[]} queryParams - The query params
   * @param {resourceCallback} callback
   */
  _GETRequest: function (auth, resource, id, queryParams, callback) {
    _queryString = qs.stringify(queryParams);
    if (_queryString.length > 0) {
      _queryString = '?' + _queryString;
    }

    var idQuery = id ? '/'+id : '';

    this._fleetlogRequest("GET", resource + idQuery + _queryString, null, auth, function (error, results) {
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
   * @param {string} auth - Access Token
   * @param {requestCallback} callback
   * @private
   */
  _fleetlogRequest: function (method, path, data, auth, callback) {
    _requestMethod = (method || "GET").toUpperCase();

    _contentLength = data ? (JSON.stringify(data).length) : 0;

    _headers = {
      "Authorization": "Bearer " + auth,
      "Content-Type": "application/json",
      "Accept": "application/json",
      "User-Agent": 'Fleetlog/v2 Node/0.1', //TODO: actual package version
      "Content-Length": _contentLength
    };

    _requestBody = {
      method: _requestMethod,
      url: this._api_host + '/v2/'+  path,
      headers: _headers
    };

    if (data != null) {
      _requestBody.formData = data;
    }

    return request(_requestBody, function (err, result, body) {
      if (result.statusCode == 401) {
        return callback(UNAUTHORIZED)
      } // TODO: Error handling
      if (result.statusCode == 400) {
        return callback(BADREQUEST)
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

module.exports = Fleetlog;
