const express = require('express');
const User = require('../models/user');
const AsyncWrap = require('../utilities/AsyncWrap');
const passport = require('passport');
const router = express.Router({ mergeParams: true });

// GET Login Form
router.get('/login', (req, res) => {
    console.log(req.originalUrl)
    res.render('auth/login', { user: req.user });
})

// POST Login/authenticate User
router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect:'/login' }), (req, res) => {
    req.flash('success', 'Logged in successfully.');
    const redirectUrl = req.session.returnTo || '/campgrounds';
    delete req.session.returnTo; // Deletes the returnTo from the request object
    res.redirect(redirectUrl);
})

// GET User Registration Form
router.get('/register', (req, res) => {
    res.render('auth/register');
})

// POST New User
router.post('/register', AsyncWrap(async (req, res, next) => {
    try {
        const { username, email, password } = req.body.user;
        const user = new User({ email, username });
        const registeredUser = await User.register(user , password);
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash('success', 'Welcome to YelpCamp!');
            res.redirect('/campgrounds');
        })
    } 
    catch (err) {
        req.flash('error', err.message);
        res.redirect('register');
    }
}));

router.get('/logout', (req, res, next) => { return (!req.isAuthenticated()) ? res.redirect('/campgrounds') : next() }, (req, res) => {
    req.logout();
    req.flash('success', 'Goodbye for now!');
    res.redirect('/campgrounds');
})

module.exports = router;