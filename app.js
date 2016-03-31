//Secretes

var mClientId = "5d3f51357e4844569d00c9099f6907cf";
var mClientSecret = "bb3081bd5e5c45c7b8abe98d0730c13f";
var mCallbackUrl = "http://192.168.43.150:3000/handle_auth";
var redirect_uri = "http://192.168.43.150:3000/handle_auth";




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
    api.authorize_user(req.query['code'], redirect_uri, function (err, result) {
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
    res.send(JSON.stringify({
        url: api.get_authorization_url(redirect_uri, {
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