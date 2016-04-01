//Secretes

var mClientId = "b06619e103e9455a8a6a63665fafb022";
var mClientSecret = "0c2224879d01409dacdc8f270bbc8515";
var mCallbackUrl = "https://glacial-island-25064.herokuapp.com/handle_auth";
var redirect_uri = "https://glacial-island-25064.herokuapp.com/handle_auth";




//  Dependencies


var http = require('http');
var express = require('express');
var bodyParser = require('body-parser');
var instagram = require('instagram-node').instagram();


// Instagram

instagram.use({
    client_id: mClientId,
    client_secret: mClientSecret
});

exports.handleAuth = function (req, res) {
    instagram.authorize_user(req.query['code'], redirect_uri, function (err, result) {
        if (err) {
            console.log(err.body);
            res.send("ERROR");
        } else {
            console.log("Ye you did it" + result.access_token);
            res.send("OK");
        }
    });
}

exports.authorize_user = function (req, res) {
    console.log("Authorise called")
    res.redirect(JSON.stringify({
        url: instagram.get_authorization_url(redirect_uri, {
            scope: ['likes'],
            state: 'a state' //use for security
        })
    }));
};


//  Express

var app = express();
app.set('port', (process.env.PORT || 5000));
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());



// Routes
app.get('/authorize_user', exports.authorize_user);
app.get('/handle_auth', exports.handleAuth);
app.get('/', function (req, res) {
    res.send("Welcome");
});

app.listen(app.get('port'), function () {
    console.log('Node app is running on port', app.get('port'));
});