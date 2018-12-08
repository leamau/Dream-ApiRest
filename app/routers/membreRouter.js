// utilisation d'un routeur Express
var express = require('express');
var routerMembres = express.Router();
// utilisation du controlleur de gestion des membres
var membresController = require('../controllers/membresController');
var userController = require('../controllers/userController')



routerMembres.use(userController.verifJWT);
routerMembres.get('/', membresController.getMembres);
routerMembres.get('/:id', membresController.index);
routerMembres.post('/', membresController.ajout);
routerMembres.put('/', membresController.modification);
routerMembres.delete('/:id', membresController.suppression);


module.exports = routerMembres;
