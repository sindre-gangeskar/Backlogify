require('dotenv').config();
var express = require('express');
var cors = require('cors');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const session = require('express-session');
const SQLiteStore = require('connect-sqlite3')(session);

const corsOptions = {
    origin: 'http://localhost:5173', // Your React app's URL
    credentials: true
};

var indexRouter = require('./routes/index');
var authRouter = require('./routes/auth');

var app = express();

app.use(cors(corsOptions));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    saveUninitialized: false,
    resave: false,
    secret: process.env.SECRET,
    cookie: {
        maxAge: 1000 * 60 * 60
    },
    store: new SQLiteStore({
        ttl: 60,
        pruneInterval: 1
    })
}));



app.use('/', indexRouter);
app.use('/auth', authRouter);

module.exports = app;
