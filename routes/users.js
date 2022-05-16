const express = require('express');
const router = express.Router({ mergeParams: true });
const passport = require('passport');
const users = require('../controllers/users');
const AsyncWrap = require('../utilities/AsyncWrap');
const { isUserAuthenticated } = require('../middleware');

router.route('/login')
    .get(users.getLoginForm)
    .post(passport.authenticate('local', { failureFlash: true, failureRedirect:'/login' }), users.loginUser);

router.route('/register')
    .get(users.getRegisterForm)
    .post(AsyncWrap(users.registerNewUser));

router.get('/logout', isUserAuthenticated, users.logoutUser)

module.exports = router;