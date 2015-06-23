# Fleetlog Node
Fleetlog API wrapper

## Installation
```
npm install fleetlog
```

## API Overview
This SDK is designed to be the simplest way to make request to the Fleetlog API.

```
var fleetlog = require('fleetlog');

// see Examples for obtaining an access token.
fleetlog.identity('access-token', function (err, userObject){
  if (!error) {
  	console.log(userObject)  
  }
})
```

### API Docs
http://docs.fleetlogapiv2.apiary.io/#


## Methods
### identity
- identity(token ```string```, callback ```function```)
```
fleetlog.identity('access-token', function (err, userObject){
  	console.log(userObject)  
})
```

### getVehicles
- identity(token ```string```, callback ```function```)
```
fleetlog.getVehicles('access-token', { limit: 5, offset: 0}, function (err, vehicles){
  	console.log(vehiclesArray)  
})
```

### getTrips
- identity(token ```string```, query ```object```, callback ```function```)
```
fleetlog.getTrips('access-token', { limit: 5, offset: 0}, function (err, trips){
  	console.log(tripsArray)  
})
```

### getTrip
- identity(token ```string```,  tripId ```number```, query ```object```,  callback ```function```)
```
fleetlog.getTrip('access-token', 12345, null, function (err, tripObject){
  	console.log(tripObject)  
})
```

### getVehicle
- identity(token ```string```,  vehicleId ```number```, query ```object```,  callback ```function```)
```
fleetlog.getVehicle('access-token', 12345, null, function (err, vehicleObject){
  	console.log(vehicleObject)  
})
```

### getCoordinates
- identity(token ```string```, query ```object```,  callback ```function```)
```
fleetlog.getCoordinates('access-token', { fields: ['latitude', 'longitude', 'id', 'datetime']}, function (err, coordinates){
  	console.log(coordinatesArray)  
})
```

### getTripWithCoordinates
- identity(token ```string```, tripId ```number```, query ```object```,  callback ```function```)
```
fleetlog.getTripWithCoordinates('access-token', 12345, { 'coordinates[fields]': 'datetime'}, function (err, tripObject){
  	console.log(tripObject)  
})
```

### Custom request
- _fleetlogRequest(method ```string```, path ```string```, data ```object```, token ```string```, callback ```function```)
```
fleetlog._fleetlogRequest('GET', 'trips?limit=5&offset=0', null, 'access-token', function (err, response){
	// Response object
	// { "status": 200, data: [...]} or { "status": 200, data: {...}}
  	console.log(response)  
})
```


## Examples Apps
In order to make authorized calls to Fleetlog API, 
your application must first obtain an OAuth 2.0 access token on behalf 
of a Fleetlog user or you could issue Application-only authenticated 
requests when user context is not required. The way you will obtain such tokens will depend on your use case.

### oAuth2-authorization-code
Access to web APIs by native clients and websites is implemented by using the OAuth 2.0.

The authorization code grant type is the most commonly used because it is optimized for server-side applications, 
where source code is not publicly exposed, and Client Secret confidentiality can be maintained. 
This is a redirection-based flow, which means that the application must be capable of interacting with the user-agent (i.e. the user's web browser) 
and receiving API authorization codes that are routed through the user-agent.

### oauth2-resource-owner-password-credentials
The resource owner password credentials grant type is suitable in cases where the resource owner has a trust relationship with the client, 
such as the device operating system or a highly privileged application. 
The authorization server should take special care when enabling this grant type and only allow it when other flows are not viable.

This grant type is suitable for clients capable of obtaining the resource owner’s credentials (username and password, 
typically using an interactive form). It is also used to migrate existing clients using 
direct authentication schemes such as HTTP Basic or Digest authentication to OAuth by converting the stored credentials to an access token:

References from the RFC:     
[Resource Owner Password Credentials](http://tools.ietf.org/html/rfc6749#section-1.3.3)  
[Resource Owner Password Credentials Grant](http://tools.ietf.org/html/rfc6749#section-4.3)


### Run the Example app
Run the app with environment variables

```
node app FLEETLOG_CLIENT_ID=<YOUR_CLIENT_ID> FLEETLOG_CLIENT_SECRET=<YOUR_CLIENT_SECRET>
```

Open `localhost:3001` in your browser.

### Support 

support@fleetlog.com.au

## License

This project is licensed under the terms of the Apache 2.0 license.