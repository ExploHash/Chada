var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    if(req.session && req.session.isLoggedIn){//check login
        res.redirect("/chat");        
    }else{
        res.render("login");
    }
});

router.get('/register', function(req, res, next) {
    if(req.session && req.session.isLoggedIn){//check login
        res.redirect("/chat");        
    }else{
        res.render("register");
    }
});

router.get('/chat', function(req, res, next) {
    if(req.session && req.session.isLoggedIn){//check login
        res.render("chat");
    }else{
        res.redirect("/");
    }
});

router.get('/logout', function(req, res, next){//log de gebruiker uit
    req.session.destroy();
    res.redirect("/");
});

module.exports = router;