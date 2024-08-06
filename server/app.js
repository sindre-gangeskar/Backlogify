require('dotenv').config();
var express = require('express');
var cors = require('cors');
var path = require('path');
var fs = require('fs');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const session = require('express-session');
const SQLiteStore = require('connect-sqlite3')(session);

const allowedOrigins = [ 'https://backlogify-client.up.railway.app' ];

const corsOptions = {
    origin: (origin, callback) => {
        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true, // Enable the Access-Control-Allow-Credentials header
};

app.use(cors(corsOptions));

var indexRouter = require('./routes/index');
var authRouter = require('./routes/auth');

const dbDirectory = path.resolve(__dirname, './db');
if (!fs.existsSync(dbDirectory)) {
    fs.mkdirSync(path.join(__dirname, 'db'));
}

var app = express();

app.use(cors({credentials: true}));
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
        maxAge: 1000 * 60 * 60 * 3,
        secure:true
    },
    store: new SQLiteStore({
        ttl: 60 * 60 * 3,
        pruneInterval: 60 * 60 * 15,
        db: 'sessions.db',
        dir: dbDirectory,
    })
}));

app.use((req, res, next) => {
    console.log('Session data on request:', req.session);
    next();
})

app.use('/', indexRouter);
app.use('/auth', authRouter);


module.exports = app;
