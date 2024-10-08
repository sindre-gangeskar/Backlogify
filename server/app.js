require('dotenv').config();
const jsend = require('jsend');
const { errorHandler } = require('./middleware/middleware');
var express = require('express');
var cors = require('cors');
var path = require('path');
var fs = require('fs');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const session = require('express-session');
const SQLiteStore = require('connect-sqlite3')(session);


const allowedOrigins = [
    process.env.BACKLOGIFY_CLIENT_BASE_URL,
    `https://${process.env.BACKLOGIFY_CLIENT_BASE_URL}`,
    `http://${process.env.BACKLOGIFY_CLIENT_BASE_URL}`,
]

const corsOptions = {
    origin: function (origin, cb) {
        if (!origin) return cb(null, true);

        if (allowedOrigins.includes(origin)) return cb(null, true)

        else cb(new Error('Not allowed by CORS'))
    },
    credentials: true,
};


var indexRouter = require('./routes/index');
var authRouter = require('./routes/auth');

const dbDirectory = path.join(__dirname, 'db');
if (!fs.existsSync(dbDirectory)) {
    fs.mkdirSync(path.join(__dirname, 'db'), { recursive: true });
}

var app = express();
app.use(jsend.middleware);
app.set('trust proxy', true);
app.use(cors(corsOptions));

app.options('*', cors(corsOptions));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    saveUninitialized: false,
    resave: false,
    secret: process.env.SESSION_SECRET,
    cookie: {
        maxAge: 1000 * 60 * 60 * 3,
        secure: process.env.NODE_ENV !== 'dev' ? true : false,
        sameSite: process.env.NODE_ENV !== 'dev' ? 'none' : '',
    },
    store: new SQLiteStore({
        ttl: 60 * 60 * 3,
        pruneInterval: 60 * 60 * 15,
        db: 'sessions.db',
        dir: dbDirectory,
    })
}));

app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use(errorHandler);
module.exports = app;
