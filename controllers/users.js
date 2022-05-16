const User = require('../models/user');

// GET Login Form
module.exports.getLoginForm = (req, res) => {
    res.render('auth/login', { user: req.user });
};

// POST Login/authenticate User
module.exports.loginUser = (req, res) => {
    req.flash('success', 'Logged in successfully.');
    const redirectUrl = req.session.returnTo || '/campgrounds';
    delete req.session.returnTo; // Deletes the returnTo from the request object
    res.redirect(redirectUrl);
};

// GET User Registration Form
module.exports.getRegisterForm = (req, res) => {
    res.render('auth/register');
};

// POST New User
module.exports.registerNewUser = async (req, res, next) => {
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
};

// GET Logout User
module.exports.logoutUser = (req, res) => {
    req.logout();
    req.flash('success', 'Goodbye for now!');
    res.redirect('/campgrounds');
};