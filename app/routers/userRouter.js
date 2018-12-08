// utilisation d'un routeur Express
var express = require('express');
var routerUser = express.Router();
// utilisation du controlleur de gestion des sportifs
var usersController = require('../controllers/userController');

//routerUser.get('/?name=:name&password=:password', usersController.demandejeton);
routerUser.get('/jeton', usersController.demandejeton);
routerUser.get('/',usersController.verifJWT,usersController.verifAdmin, usersController.liste);
routerUser.post('/', usersController.ajout);
routerUser.get('/admin', usersController.verifAdmin);
//routerUser.get('/verifjeton',usersController.verifjeton)

module.exports = routerUser;
