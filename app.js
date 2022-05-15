// Require modules/files
const express = require('express');
const mongoose = require('mongoose');
const engine = require('ejs-mate');
const methodOverride = require('method-override');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const flash = require('connect-flash');
const ExpressError = require('./utilities/ExpressError');
const users = require('./routes/users');
const campgrounds = require('./routes/campgrounds');
const reviews = require('./routes/reviews');
const User = require('./models/user');
const path = require('path');
const port = 3000;
const dbUrl = 'mongodb://127.0.0.1:27017/yelpCamp';

// Connects to the mongodb:
// When the connection readyState is 'open', it will log that the application is connected to the db.
// When an error occurs, it will log the error.
mongoose.connect(dbUrl);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Connected to Database');
})

const sessionConfig = {
    secret: 'secret', // TODO: Change later for deployment
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true, // True by default
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // No expiry by default, so we need to set one
        maxAge: 1000 * 60 * 60 * 24 * 7 // Multiplies the seconds to a week
    }
};

const app = express();

// Use ejs-locals for all ejs templates:
app.engine('ejs', engine);

// Application Settings
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Mounting Express Middleware
//app.use(express.json()) // for parsing application/json
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(methodOverride('_method')); // override methods using query string value
app.use(session(sessionConfig));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session()); // Needs to be used after 'session'

// Passport config
// Uses the local-strategy & generates the authenticate function onto the user model
passport.use(new LocalStrategy(User.authenticate())); 
// Tell passport how to serialize/deserialize users into a session & generates them into the user model
passport.serializeUser(User.serializeUser()); 
passport.deserializeUser(User.deserializeUser()); 

app.use((req, res, next) => {
    if (!['/login', '/'].includes(req.originalUrl)) {
        req.session.returnTo = req.originalUrl;
    }
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

// ROUTES
app.get('/seedUser', async (req, res) => {
    await User.register(new User({ email : 'test@email.com', username: 'testuser' }), 'testing', function(err, user) {
        if (err) {
            return res.send('error');
        }
    res.send("Registration Completed")
    });
})

app.get('/', async function (req, res) {
    res.render('index');
});

// Express will run the request to specified route
app.use('/', users)
app.use('/campgrounds', campgrounds);
app.use('/campgrounds/:id/reviews/', reviews); // One way to bring params to the router is by adding a property in the req object, however we use the option in Router to merge params

app.all('*', (req, res, next) =>
    next(new ExpressError('Page Not Found', 404))
);

app.use((err, req, res, next) => {
    if(err.name === 'ValidationError') err = new ExpressError("Incorrect Price", 400);
    next(err);
});

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Something Went Wrong';
    res.status(statusCode).render('error', {err});
});

app.listen(port, () => {
    console.log(`YelpCamp app now serving on port ${port}`);
});