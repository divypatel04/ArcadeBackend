"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const request_1 = __importDefault(require("request"));
const port = 80;
const app = (0, express_1.default)();
var clientID = '0139d82a-3ffd-4047-a350-5f9e2da1ae79', clientSecret = 'N1ikbzmQvKIO6ComPSP84nQjtX3IUHUl5pb7baooPxW';
var appBaseUrl = 'https://arcadeapp.site', appCallbackUrl = appBaseUrl + '/oauth';
var provider = 'https://auth.riotgames.com', authorizeUrl = provider + '/authorize', tokenUrl = provider + '/token';
app.get('/oauth', (req, res) => {
    var accessCode = req.query.code;
    // Display a message before redirecting
    //   var redirectingMessage = `<html>
    //   <head>
    //     <meta charset="utf-8" />
    //     <meta http-equiv="x-ua-compatible" content="ie=edge" />
    //     <meta name="viewport" content="width=device-width, initial-scale=1" />
    //   </head>
    //   <body style="margin: 0">
    //     <div style="justify-content: center; align-items: center; display: inline-grid; margin: 20px 10px 20px 10px">
    //       <img src="https://arcadeapp.site/assets/images/arcade-logo.jpg" alt="#" style="width: 200px; height: auto" />
    //       <p style="font-size: 32px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; font-weight: 600">
    //         Redirecting to app. Please wait...
    //       </p>
    //     </div>
    //     <div style="margin: 20px 10px 20px 10px; padding: 20px 10px; background-color: beige">
    //       <h3 style="margin: 0; text-transform: uppercase; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif">Note</h3>
    //       <p style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 10px 0">Press Continue if you see this message.</p>
    //       <img src="https://arcadeapp.site/assets/images/notemessage.jpg" alt="#" style="width: 230px; height: auto" />
    //     </div>
    //   </body>
    // </html>`;
    //   // Send the initial response with the message
    //   res.send(redirectingMessage);
    // Delay the redirect by 3 seconds
    request_1.default.post({
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
    }, (error, response, body) => {
        if (!error && response.statusCode == 200) {
            // parse the response to JSON
            var payload = JSON.parse(body);
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
            res.redirect(302, redirectUrl);
        }
        else {
            res.send('/token request failed error: ' + error);
        }
    });
});
// Website Data
// --------------------------------
// --------------------------------
// --------------------------------
// --------------------------------
// --------------------------------
app.use('/', express_1.default.static(path_1.default.join(__dirname, 'public')));
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
app.use(express_1.default.static('files'));
app.listen(port, () => console.log(`App listening on Port ${port}`));
