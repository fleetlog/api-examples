var qs = require('querystring');

module.exports = Fleetlog;

function Fleetlog(client_id, client_secret) {
  this._client_id = client_id;
  this._client_secret = client_secret;
}

Fleetlog.prototype = {
  _api_host: 'api.fleetlog.com.au',
  _api_port: 443,
  _api_access_token: '',


  identity: function (callback) {
    return 'Not implemented yet.'
  }
}