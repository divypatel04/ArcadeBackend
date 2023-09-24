'use strict';
// const request = require('request');
// const express = require('express');
// const path = require('path');
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
const express_1 = __importDefault(require('express'));
const path_1 = __importDefault(require('path'));
const request_1 = __importDefault(require('request'));
// import * as request from 'request';
const port = 3000;
const app = (0, express_1.default)();
var clientID = 'client_id',
  clientSecret = 'client_secret';
var appBaseUrl = 'http://localhost:3000',
  appCallbackUrl = appBaseUrl + '/oauth';
var provider = 'https://auth.riotgames.com',
  authorizeUrl = provider + '/authorize',
  tokenUrl = provider + '/token';
app.get('/login', (req, res) => {
  var link = authorizeUrl + '?redirect_uri=' + appCallbackUrl + '&client_id=' + clientID + '&response_type=code' + '&scope=openid';
  // create a single link, send as an html document
  res.send('<a href="' + link + '">Sign In</a>');
});
app.get('/oauth', (req, res) => {
  var accessCode = req.query.code;
  // make server-to-server request to token endpoint
  // exchange authorization code for tokens
  request_1.default.post(
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
    (error, response, body) => {
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
        res.send('<pre>' + JSON.stringify(tokens) + '</pre>');
      } else {
        res.send('/token request failed');
      }
    }
  );
});
app.get('/oauth-test', (req, res) => {
  var tt = {
    refresh_token: 'skfnksnfksn',
    id_token: 'dnsndisn',
    access_token: 'dnsndisn'
  };
  res.send('<pre>' + JSON.stringify(tt) + '</pre>');
});
app.use('/', express_1.default.static(path_1.default.join(__dirname, '/public/')));
app.get('/', (req, res) => {
  res.sendFile(path_1.default.join(__dirname, '/src/index.html'));
});
app.get('/contact', (req, res) => {
  res.sendFile(path_1.default.join(__dirname, '/src/contact.html'));
});
app.get('/privacy-policy', (req, res) => {
  res.sendFile(path_1.default.join(__dirname, '/src/PP.html'));
});
app.get('/terms', (req, res) => {
  res.sendFile(path_1.default.join(__dirname, '/src/Terms.html'));
});
// app.use(express.static('files'));
app.listen(port, () => console.log(`Example app listening on post ${port}!`));
