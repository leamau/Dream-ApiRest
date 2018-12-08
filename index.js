var mongoose = require('mongoose');
var express = require('express');
var routerMembres = require("./app/routers/membreRouter");
var routerUsers = require("./app/routers/userRouter")
var db = mongoose.connect("mongodb://localhost/collegefrance");
mongoose.Promise = global.Promise;


// lancer le serveur pour qu'il écoute sur le port 5000
var port = 5000;
var app = express();



app.get('/', function (req, res) {
    res.send('Bienvenue sur le serveur REST de l’API du Collège de France');
});

let BodyParser = require('body-parser');
app.use(BodyParser.json());

app.use('/membres', routerMembres);
app.use('/users', routerUsers);


// lancement du serveur qui se met à l'écoute
app.listen(port);




//BODY explication prof
/*
let BodyParser = require('body-parser');
app.use(BodyParser.json());
*/


