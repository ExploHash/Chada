const express = require('express');
const Datastore = require('nedb')
const uuid = require("uuidv4");
const crypto = require('crypto');

var router = express.Router();
var db = new Datastore({ filename: './data/main.nedb', autoload: true }); //laad database

router.post('/register', function(req, res, next) {
    var requiredParms = ["name", "surname", "email", "password", "passwordRepeat"];
    //check voor alle variablen
    for(let parmIndex in requiredParms){
        let parm = requiredParms[parmIndex];
        if(req.body[parm] === undefined || req.body[parm].length < 1){
            valError(res, "Mising " + parm);
            return next();
        }
        //check if string
        if(typeof parm !== "string"){
            valError(res, parm + " is not a string");
            return next();
        }
    }
    //check meer
    if(req.body.name.length > 100){
        valError(res, req.body.name + " can't be longer than 100 chars");
    }else if(!validateName(req.body.name)){
        valError(res, "Name can only consist of numbers and letters");
    }else if(req.body.surname.length > 100){
        valError(res, req.body.surname + " can't be longer than 100 chars");
    }else if(!validateName(req.body.surname)){
        valError(res, "Surname can only consist of numbers and letters");
    }else if(!validateEmail(req.body.email)){
        valError(res, req.body.email + " is not a real email adress");
    }else if(req.body.password > 200){
        valError(res, req.body.password + " can't be longer than 200 chars");
    }else if(req.body.password !== req.body.passwordRepeat){
        valError(res, "Passwords are not equal!");
    }else{
        //check of er al een email bestaat
        db.find({email: req.body.email}, function(err, results){
            //stop het erin
            if(err || results.length === 0){
                var object = {
                    username: uuid(),
                    email: req.body.email,
                    name: req.body.name,
                    surname: req.body.surname,
                    password: crypto.createHash("sha512").update(req.body.password).digest('hex'),
                }
                db.insert(object, function(err, inserted){
                    if(err){
                        res.status(500).json({message: "Failed to write to database"});
                    }else{
                        res.redirect("/");
                    }
                });
            }else{
                valError(res, "Email already exists");
            }
        });
    }
});

router.post('/login', function(req, res, next) {
    if(req.body.email && req.body.password){
        var search = {
            email: req.body.email,
            password: crypto.createHash("sha512").update(req.body.password).digest('hex')
        }
        //find een gebruiker met hetzelfde gebruikersnaam en wachtwoord en log hem daarna in
        db.find(search, function(err, results){
            if(err || results.length === 0){
                valError(res, "Email or password incorrect!");
            }else{
                req.session.isLoggedIn = true;
                req.session.name = results[0].name + " " + results[0].surname;
                res.json({message: "Succesfully logged in!"})
            }
        });
    }else{
        valError(res, "Please provide email and password");
    }
});
//verkrijg de loginstatys
router.get('/loginstatus', function(req, res, next){
    if(req.session && req.session.isLoggedIn){
        res.json({loggedIn: true, username: req.session.name});
    }else{
        res.json({loggedIn: false});
    }
});
//log de gebruiker uit
router.get('/logout', function(req, res, next){
    req.session.destroy();
    res.json({success: true, message: "Succesfully logged out!"});
});

function validateEmail(email) {//opensource functie gebruik door chrome
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

function validateName(name){
    var re = /^[a-zA-Z0-9_.-]*$/;
    return re.test(String(name));
}

function valError(res, message){
    res.status(400).json({message: message, code: "InvalidParameterException"});
}

module.exports = router;