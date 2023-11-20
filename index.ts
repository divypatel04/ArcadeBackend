import express from 'express';
import path from 'path';
import request from 'request';
import * as requestPromise from 'request-promise';

const port = 80;
const app = express();

var clientID = '0139d82a-3ffd-4047-a350-5f9e2da1ae79',
  clientSecret = 'N1ikbzmQvKIO6ComPSP84nQjtX3IUHUl5pb7baooPxW';

var appBaseUrl = 'https://arcadeapp.site',
  appCallbackUrl = appBaseUrl + '/oauth';

var provider = 'https://auth.riotgames.com',
  authorizeUrl = provider + '/authorize',
  tokenUrl = provider + '/token';

app.get('/oauth', async (req, res) => {
  try {
    var accessCode = req.query.code;

    // Display a message before processing
    var processingMessage = `<html>
    <head>
      <meta charset="utf-8" />
      <meta http-equiv="x-ua-compatible" content="ie=edge" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
    </head>
    <body style="margin: 0">
      <div style="justify-content: center; align-items: center; display: inline-grid; margin: 20px 10px 20px 10px">
        <img src="https://arcadeapp.site/assets/images/arcade-logo.jpg" alt="#" style="width: 200px; height: auto" />
        <p style="font-size: 32px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; font-weight: 600">
          Redirecting to app. Please wait...
        </p>
      </div>

      <div style="margin: 20px 10px 20px 10px; padding: 20px 10px; background-color: beige">
        <h3 style="margin: 0; text-transform: uppercase; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif">Note</h3>
        <p style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 10px 0">Press Continue if you see this message.</p>
        <img src="https://arcadeapp.site/assets/images/notemessage.jpg" alt="#" style="width: 230px; height: auto" />
      </div>
    </body>
  </html>`; // Your HTML code
    res.send(processingMessage);

    // Perform the token request
    const response = await requestPromise.post({
      url: tokenUrl,
      auth: {
        user: clientID,
        pass: clientSecret
      },
      form: {
        grant_type: 'authorization_code',
        code: accessCode,
        redirect_uri: appCallbackUrl
      }
    });

    // parse the response to JSON
    var payload = JSON.parse(response);
    // separate the tokens from the entire response body
    var tokens = {
      refresh_token: payload.refresh_token,
      id_token: payload.id_token,
      access_token: payload.access_token
    };

    console.log('Tokens Generated and Redirected', tokens);

    // legibly print out our tokens
    const redirectUri = 'arcadeauth://oauth2redirect';
    const redirectUrl = `${redirectUri}?tokens=${JSON.stringify(tokens)}`;

    // Redirect back to the app
    res.redirect(302, redirectUrl);
  } catch (error) {
    console.error('/token request failed error:', error);
    res.send('/token request failed error: ' + error);
  }
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
