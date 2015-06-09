#Fleetlog Examples

###oAuth2-authorization-code
Access to web APIs by native clients and websites is implemented by using the OAuth 2.0.

The authorization code grant type is the most commonly used because it is optimized for server-side applications, 
where source code is not publicly exposed, and Client Secret confidentiality can be maintained. 
This is a redirection-based flow, which means that the application must be capable of interacting with the user-agent (i.e. the user's web browser) 
and receiving API authorization codes that are routed through the user-agent.

### Install required modules
```
    npm install
```

### Run the app
```
    node app FLEETLOG_CLIENT_ID=<YOUR_CLIENT_ID> FLEETLOG_CLIENT_SECRET=<YOUR_CLIENT_SECRET>
```

Open `localhost:3001` in your browser.

## License

This project is licensed under the terms of the Apache 2.0 license.