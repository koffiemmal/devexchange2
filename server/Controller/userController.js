const database = require("../config/mysql")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })
require("dotenv").config();

exports.inscription = (req, res) => {
    upload.single('image')(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            
            console.log(err);

            res.status(500).json({error:"error during file upload"});
            
            return;
        } else if (err) {
            
            console.log(err);
            res.status(500).json({error:"unknown error during file upload"});
            return;
        }

        
        let inscription_user = "insert into utilisateurs (nom_user,prenom_user,pseudo_user,photo_user,email_user,password_user) VALUES(?,?,?,?,?,?);"
        bcrypt.hash(req.body.password_user, 5)
        .then((hash) => {
            database.query(inscription_user, [req.body.nom_user, req.body.prenom_user, req.body.pseudo_user, req.file.path, req.body.email_user, hash], (error, result) => {
                if (error) {
                    console.log(error);
                    res.status(500).json({error: "erreur lors de l'inscription"});
                } else {
                    console.log(req.body);
                    res.status(201).json({hash: hash});
                }
            });
        })
        .catch((error) => {
            console.log(error);
        });
    });
}


exports.connexion=(req,res)=>{
    let rechercheutilisateur = "SELECT * FROM utilisateurs WHERE email_user = ?";
    
    database.query(rechercheutilisateur,[req.body.email_user],(error,result)=>{
        if(error){
            res.status(500).json(error)
            return;
        }

        if(result.length>0){

            bcrypt.compare(req.body.password_user, result[0].password_user )
            .then((valid)=>{
                if(valid){
                    let id_user_id = result[0].id_user
                    let accessToken = jwt.sign(
                        {id_user:result[0].id_user},
                        "12345678",
                        {expiresIn:"72h"}
                    );
                    res.status(200).json({accessToken,id_user_id});
                }
                else{
                    res.status(200).json({error:"Mot de passe ou email incorrect"})
                }

                
            })
            .catch((error)=>{
                console.log(error)
                res.status(500).json({error :"erreur lors de la comparaison"});
            });
        
}else{
    res.status(404).json({error:"Utilsateur introuvable"})
}
    });
};

exports.selection = (req,res)=>{
    const sql = 'SELECT * FROM utilisateurs where id_user=?;'
    database.query(sql,[req.body.id_user],(error,result)=>{
        if(error){
            res.status(403).json({error:"l'id n'ait pas parvenu"})
        }
        else{
            res.status(203).json(result[0])
        }
    })
}


