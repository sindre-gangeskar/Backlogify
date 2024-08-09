const express = require('express');
const router = express.Router();
const SteamSignIn = require('steam-signin');
const axios = require('axios');
const jsend = require('jsend');
const steamSignIn = new SteamSignIn(process.env.STEAM_SERVER_REALM);
let referrer;


router.use(jsend.middleware);

router.get('/login', function (req, res, next) {
    res.statusCode = 302;
    console.log(process.env.STEAM_SERVER_REALM);
    res.setHeader('Location', steamSignIn.getUrl(`${process.env.STEAM_SERVER_REALM}/auth/login/authenticated`));
    res.end();
});
router.get('/login/authenticated', async function (req, res, next) {
    try {
        const steam = await steamSignIn.verifyLogin(req.url);
        const steamid64 = steam.getSteamID64();
        const response = await axios.get(`https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${process.env.STEAM_API_KEY}&steamids=${steamid64}`);
        const { personaname, avatarfull } = response.data.response.players[ 0 ];

        req.session.regenerate((err) => {
            if (err) { console.log(err); return }

            req.session.user = { steamid64, personaname, avatarfull };

            req.session.save(err => {
                if (err) { console.log(err); return }
                res.redirect(`${process.env.BACKLOGIFY_CUSTOM_CLIENT_URL}`);
            })
        })
    } catch (error) {
        console.error('Error during authentication:', error);
        return res.status(500).send('Internal Server Error');
    }
});
router.get('/', async function (req, res, next) {
    referrer = req.headers;
    return res.jsend.success({ user: req.session.user || null, authenticated: !!req.session.user });
});
router.get('/logout', function (req, res, next) {
    res.clearCookie('connect.sid', { domain: process.env.BACKLOGIFY_CLIENT_BASE_URL, path: '/' });
    req.session.destroy(err => {
        if (err) console.log('Could not delete session', err);
        res.clearCookie('connect.sid');
        return res.jsend.success({ message: 'Successfully logged out' })
    })
});

module.exports = router;