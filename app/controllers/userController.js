// utilisation du Model Sportif pour faire le lien avec la BD
var userModel = require('../models/userModel');
var jwt = require("jsonwebtoken");
var jwt_decode = require("jwt-decode");
var jws = require('jws');
// définition du controller sous la forme d'un objet JS avec des propriétés
var userController = {
    liste : function(req,res){
        // find
        userModel.find({},{_id : 0, name : 1,mail : 1}).sort({nom : 1})
        .then((User)=>res.send(User))
        .catch((err) => res.send(err.message));
    },

    ajout : function(req,res){
        userModel.findOne({mail : req.body.mail }, { _id :1 }).then((user)=>{
            if(user != null){
                res.json({"status":false,"message": "un user avec cet email existe déjà" })
            }else {
    
                let newUser = new userModel(req.body);
    
                newUser.validate()
                .then(() => {
                    return newUser.save();
                })
                .catch((err) => res.json({"status":false,"message": "user validation failed : "+err.message }))
            }
        })
        .then(()=> res.json({"status":true,"user": "user ajouté"}))
        .catch((err) => res.json({"status":false,"message": "user validation failed : "+err.message }))
    
    },

   
    demandejeton : function(req,res){
        //on teste si le nom et le mdp sont entrés, 
        if(req.body.name == null || req.body.password == null){
            // si pas de pswd ou name on affiche erreur d'abscence
            res.json({"status":false,"message": "name et/ou password absents"})

        }else{

            userModel.findOne({name:req.body.name,password:req.body.password},{ _id :0,name:1,password:1,admin:1 }).then((user)=>{ 

            //si la combinaison name/mdp n'existe pas on affiche une erreur d'identification incorrecte 
            if(user == null){
                res.json({"status":false,"message": "name et/ou password inccorects"})
            }else{
                //sinon on génère le token.
                var payload = {username: user.name,password : user.password,admin : user.admin}
                var admin = user.admin
                var cle = "maclesecrete"
                var token = jwt.sign(payload ,cle,{ expiresIn: 3600/*,subject:admin*/});                                                               
                //affichage message de succès 
                res.json({"status":true,"token": token,"admin":user})
            }             
             })

        }
    },

    verifjeton : function(res,token){
        //token =req.body.token;
        var estcorrect = false;
        jwt.verify( token, 'maclesecrete',function(err, payload) {
            
            if (token == null){
               // res.json({ status : false, "message": 'token absent'})
                estcorrect= false;
            }else{
                if (err) {
                    //res.json({status:false, "message":'token incorrect : ' + err.message})
                    estcorrect= false;
                }else{
                   // res.json({"status":true,"payload":payload})
                    estcorrect= true;
                }
            }            
        });

        return estcorrect;
    },

    verifJWT:function(req, res, next){
        token = req.body.token; 
        if(token){
           if(userController.verifjeton(res,token)){
              // res.json({"status":true,"message":"ça fonctionne"})
               next(); 
            }else{
               res.status(403).send({status:false, "message":'no token provided'})
            }
        }else{
            res.status(403).send({ status:false, "message":'no token provided'})
        }  
    },
    

   verifAdmin : function(req,res,next){        
        var token = req.body.token
        var decoded = jws.decode(token);
        var payload = decoded.payload;
    
        if(decoded.payload.admin){
           // res.json({"message":"l'utilisateur est admin"})
           next();
        }else{
            res.json({"message":"l'utilisateur est pas admin"})
        }
        //res.json({"message":"le payload ne contient pas admin", "decoded":decoded})
            
   }


} // interface du module
module.exports = userController;