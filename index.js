const request = require('request');
const express = require('express');
const path = require('path');
const http = require('http');
const app = express();
const port = 3000;

var clientID = 'client_id',
  clientSecret = 'client_secret';

var appBaseUrl = 'http://localhost:3000',
  appCallbackUrl = appBaseUrl + '/oauth';

var provider = 'https://auth.riotgames.com',
  authorizeUrl = provider + '/authorize',
  tokenUrl = provider + '/token';

app.get('/login', function (req, res) {
  var link = authorizeUrl + '?redirect_uri=' + appCallbackUrl + '&client_id=' + clientID + '&response_type=code' + '&scope=openid';
  // create a single link, send as an html document
  res.send('<a href="' + link + '">Sign In</a>');
});

app.get('/oauth', function (req, res) {
  var accessCode = req.query.code;

  // make server-to-server request to token endpoint
  // exchange authorization code for tokens
  request.post(
    {
      url: tokenUrl,
      auth: {
        // sets "Authorization: Basic ..." header
        user: clientID,
        pass: clientSecret
      },
      form: {
        // post information as form-data
        grant_type: 'authorization_code',
        code: accessCode,
        redirect_uri: appCallbackUrl
      }
    },
    function (error, response, body) {
      if (!error && response.statusCode == 200) {
        // parse the response to JSON
        var payload = JSON.parse(body);

        // separate the tokens from the entire response body
        var tokens = {
          refresh_token: payload.refresh_token,
          id_token: payload.id_token,
          access_token: payload.access_token
        };

        // legibly print out our tokens
        res.send('<pre>' + JSON.stringify(tokens, false, 4) + '</pre>');
      } else {
        res.send('/token request failed');
      }
    }
  );
});

app.get('/oauth-test', function (req, res) {
  var tt = {
    refresh_token: 'skfnksnfksn',
    id_token: 'dnsndisn',
    access_token: 'dnsndisn'
  };

  res.send('<pre>' + JSON.stringify(tt, false, 4) + '</pre>');
});

app.use('/', express.static('public'));

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, '/src/index.html'));
});

app.get('/contact', function (req, res) {
  res.sendFile(path.join(__dirname, '/src/contact.html'));
});

app.get('/privacy-policy', function (req, res) {
  res.sendFile(path.join(__dirname, '/src/PP.html'));
});

app.get('/terms', function (req, res) {
  res.sendFile(path.join(__dirname, '/src/Terms.html'));
});
// app.use(express.static('files'));

app.listen(port, () => console.log(`Example app listening on post ${port}!`));
