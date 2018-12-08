// utilisation du Model Sportif pour faire le lien avec la BD
var membreModel = require('../models/membreModel');
// définition du controller sous la forme d'un objet JS avec des propriétés
var membresController = {
    getMembres : function(req,res){
        // find
        membreModel.find({},{_id : 0, nom : 1, prenom : 1}).sort({nom : 1})
        .then((Membre)=>res.send(Membre))
        .catch((err) => res.send(err.message));
    },

    index : function(req,res){
        membreModel.find({id: req.params.id},{_id : 0, nom : 1, prenom : 1}).sort({nom : 1})
        .then((Membre)=>res.json({"status":true,"membre" : Membre}))
        .catch((err) => res.json({"status":false,"message": "membre inexistant"}));
    },

    ajout : function(req,res){

        membreModel.findOne({id : req.body.id }, { _id :1 }).then((membre)=>{

            if(membre != null){
                res.json({"status":false,"message": "un membre avec cet id existe déjà" })
            }else {
    
                let newMembre = new membreModel(req.body );
    
                newMembre.validate().then(() => {
                    return newMembre.save();
                })
            }
        })
        .then(()=> res.json({"status":true,"membre": "membre ajouté" }))
        .catch((err) => res.json({"status":false,"message": "membre validation failed : "+err.message }))
    
    },

    modification : function(req,res){
        membreModel.findOneAndUpdate({id : req.body.id }, req.body,{new:true},function(err, Membre) {
            if(Membre == null){
                res.json({"status":false,"messsage":"un memebre avec cet id existe déjà"})
            }

        })
        .then((Membre)=>res.json({"status":true,"message" : "membre modifié"}))
        .catch((err) => res.json({"status":false,"messsage":"membre validation failed : "+res.err}))
    },

    suppression : function(req,res){
        membreModel.findOne({id : req.params.id }, { _id :1 }).then((membre)=>{
            if(membre == null){
                res.json({"status":false,"message": "membre innexistant" })
            }else {    
                membre.remove()
                .then(()=> res.json({"status":true,"membre": "membre supprimmé" }))
            }
        })
        
    
    },
} // interface du module
module.exports = membresController;