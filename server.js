const express = require('express');
const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://aarushi12:Waitwhat@cluster0.esna2.mongodb.net/ideareel?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true});
const expressSession = require('express-session');
const csrf = require('csurf');
const cookieParser = require('cookie-parser');
var MemoryStore = require('memorystore')(expressSession)
const passport = require('passport');

const flash = require('connect-flash');
const app = express();

app.set('view engine', 'ejs');
app.set('views', __dirname + '/ejsfile',);


app.use(express.urlencoded({ extended: true }));

mongoose.connect(mongoose, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true, },).then(() => console.log("Connected !"),);



app.use(cookieParser('random'));


app.use(expressSession({  
    secret: "random",
    resave: true,
    saveUninitialized: true,
    maxAge: 24 * 60 * 60 * 10000,
    store: new MemoryStore(),
}));

app.use(csrf());
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());
app.use(function (req, res, next) {
    res.locals.success_messages = req.flash('success_messages');
    res.locals.error_messages = req.flash('error_messages');
    res.locals.error = req.flash('error');
    next();
});

app.use(require('./controller/router.js'));

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => console.log("Server Started At " + PORT));