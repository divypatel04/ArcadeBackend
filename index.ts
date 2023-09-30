// const request = require('request');
// const express = require('express');
// const path = require('path');

import express from 'express';
import path from 'path';
import request from 'request';
// import * as request from 'request';

const port = 80;
const app = express();

var clientID = '0139d82a-3ffd-4047-a350-5f9e2da1ae79',
  clientSecret = 'N1ikbzmQvKIO6ComPSP84nQjtX3IUHUl5pb7baooPxW';

var appBaseUrl = 'https://arcadeapp.site',
  appCallbackUrl = appBaseUrl + '/oauth';

var provider = 'https://auth.riotgames.com',
  authorizeUrl = provider + '/authorize',
  tokenUrl = provider + '/token';

// app.get('/login', (req, res) => {
//   var link = authorizeUrl + '?redirect_uri=' + appCallbackUrl + '&client_id=' + clientID + '&response_type=code' + '&scope=openid';
//   // create a single link, send as an html document
//   res.send('<a href="' + link + '">Sign In</a>');
// });

app.get('/oauth', (req, res) => {
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
        console.log('Tokens: ', tokens);
        // legibly print out our tokens
        // res.send('<pre>' + JSON.stringify(tokens) + '</pre>');
        // res.send(`<script>window.location.replace("arcade://aut?token=${tokens}")</script>`);
        const redirectUri = 'arcade://oauth2redirect';
        const redirectUrl = `${redirectUri}?tokens=${JSON.stringify(tokens)}`;
        res.redirect(302, redirectUrl);
      } else {
        res.send('/token request failed error: ' + error);
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

// Website Data
// --------------------------------
// --------------------------------
// --------------------------------
// --------------------------------
// --------------------------------

app.use('/', express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/src/index.html'));
});
app.get('/contact', (req, res) => {
  res.sendFile(path.join(__dirname, '/src/contact.html'));
});
app.get('/privacy-policy', (req, res) => {
  res.sendFile(path.join(__dirname, '/src/PP.html'));
});
app.get('/terms', (req, res) => {
  res.sendFile(path.join(__dirname, '/src/Terms.html'));
});
app.use(express.static('files'));

app.listen(port, () => console.log(`App listening on Port ${port}`));
