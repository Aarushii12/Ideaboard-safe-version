const express = require('express');
const router = express.Router();
const user = require('../model/user');
const passport = require('passport');  
require('./passport')(passport);
const bcryptjs = require('bcryptjs'); 



function checkAuth(req, res, next) {
    if (req.isAuthenticated()) {
        res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, post-check=0, pre-check=0');
        next();
    } else {
        req.flash('error_messages', "Please Login to continue!");
        res.redirect('/login');
    }
}

router.get('/', (req, res) => {
    if (req.isAuthenticated()) {
        res.render("index", { logged: true });
    } else {
        res.render("home", { logged: false });
    }
});

router.get('/login', (req, res) => {
    res.render("login", { csrfToken: req.csrfToken() });
});

router.get('/signup', (req, res) => {
    res.render("signup", { csrfToken: req.csrfToken() });
});

router.post('/signup', (req, res) => {
    const { email, username, password, confirmpassword } = req.body;

    if (!email || !username || !password || !confirmpassword) {
        res.render("signup", { err: "All Fields Required !", csrfToken: req.csrfToken() });
    } else if (password != confirmpassword) {
        res.render("signup", { err: "Password Don't Match !", csrfToken: req.csrfToken() });
    } else {

        user.findOne({ $or: [{ email: email }, { username: username }] }, function (err, data) {     

            if (err) throw err;
            if (data) {
                res.render("signup", { err: "User Exists, Try Logging In", csrfToken: req.csrfToken() });
            } else {        
                bcryptjs.genSalt(12, (err, salt) => {
                    if (err) throw err;  
        
                    bcryptjs.hash(password, salt, (err, hash) => {   
                        if (err) throw err;
                        user({ 
                            username: username,
                            email: email,
                            password: hash,
                            googleId: null,
                            provider: 'email',
                        }).save((err, data) => {
                            if (err) throw err;
                           
                            res.redirect('/login');
                        });
                    })
                });
            }
        });
    }
});

router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        failureRedirect: '/login', 
        successRedirect: '/board',        
        failureFlash: true,
    })(req, res, next);
});


router.get('/logout', (req, res) => {
    req.logout();
    req.session.destroy(function (err) {
        res.redirect('/');
    });
});


router.get('/board', checkAuth, (req, res , data , idea) => {
    res.render('board', { username: req.user.username, verified : req.user.isVerified ,  csrfToken: req.csrfToken() , data});
  

});

router.use("/board", require("./idearoute"));



module.exports = router;
