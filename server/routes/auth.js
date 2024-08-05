const express = require('express');
const router = express.Router();
const SteamSignIn = require('steam-signin');
const axios = require('axios');
const jsend = require('jsend');
const steamSignIn = new SteamSignIn(process.env.REALM);


axios.default.withCredentials = true;
router.use(jsend.middleware);
router.get('/login', function (req, res, next) {
    res.statusCode = 302;
    res.setHeader('Location', steamSignIn.getUrl(`${process.env.REALM}/auth/login/authenticated`));
    res.end();
});

router.get('/login/authenticated', async function (req, res, next) {
    try {
        const steam = await steamSignIn.verifyLogin(req.url);
        const steamid64 = steam.getSteamID64();
        const response = await axios.get(`https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${process.env.KEY}&steamids=${steamid64}`);
        const { personaname, avatarfull } = response.data.response.players[ 0 ];

        req.session.regenerate((err) => {
            if (err) { console.log(err); return }
            console.log('User session has been generated')

            req.session.user = { steamid64, personaname, avatarfull };

            req.session.save(err => {
                if (err) { console.log(err); return }
                res.redirect(process.env.CLIENT_BASEURL);
            })
        })


    } catch (error) {
        console.error('Error during authentication:', error);
        return res.status(500).send('Internal Server Error');
    }
});

router.get('/', async function (req, res, next) {
    console.log(req.session);
    return res.jsend.success({ user: req.session?.user || null, authenticated: req.session?.user ? true : false });
});

router.get('/logout', function (req, res, next) {
    res.clearCookie('connect.sid', { domain: process.env.CLIENT_BASEURL, path: '/' });
    req.session.destroy(err => {
        if (err) console.log('Could not delete session', err);
        res.clearCookie('connect.sid');
        return res.jsend.success({ message: 'Successfully logged out' })

    })
});

module.exports = router;
