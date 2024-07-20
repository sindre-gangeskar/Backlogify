const express = require('express');
const router = express.Router();
const SteamSignIn = require('steam-signin');
const axios = require('axios');
const jsend = require('jsend');
const steamSignIn = new SteamSignIn(process.env.REALM);

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

        req.session.user = { steamid64, personaname, avatarfull };
        req.session.save(() => {
            console.log('Session saved sucessfully!');
        })

        res.redirect('http://localhost:5173');

    } catch (error) {
        console.error('Error during authentication:', error);
        return res.status(500).send('Internal Server Error');
    }
});

router.get('/', async function (req, res, next) {
    req.session.user ? console.log('User is authenticated', req.session) : console.log('User is logged out', req.session);
    if (req.session && req.session.user) {
        return res.jsend.success({ user: req.session.user, authenticated: true });
    } else {
        return res.jsend.success({ user: null, authenticated: false });
    }
});

router.get('/logout', function (req, res, next) {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying session:', err);
            return res.jsend.fail({ message: 'Failed to log out' });
        }
        res.clearCookie('connect.sid');
        return res.jsend.success({ message: 'Successfully logged out!' });
    });
});

module.exports = router;
