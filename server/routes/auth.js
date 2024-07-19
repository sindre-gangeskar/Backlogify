const express = require('express');
const router = express.Router();
const SteamSignIn = require('steam-signin');
const axios = require('axios');
const steamSignIn = new SteamSignIn(process.env.REALM);
const jsend = require('jsend');
let user;
router.use(jsend.middleware)

router.get('/login', function (req, res, next) {
    res.statusCode = 302;
    res.setHeader('Location', steamSignIn.getUrl(`${process.env.REALM}/auth/login/authenticated`));
    res.end();
})



router.get('/login/authenticated', async function (req, res, next) {
    let steamid = await steamSignIn.verifyLogin(req.url);

    const steamid64 = steamid.getSteamID64();
    const response = await axios.get(`https:/api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${process.env.KEY}&steamids=${steamid64}`);
    const { personaname, avatarfull } = response.data.response.players[ 0 ];
    req.session.user = { steamid64, personaname, avatarfull };
    await req.session.save();
    res.locals.user = req.session.user;
    user = res.locals.user;
    console.log('Successfully logged in!', user);
    return res.redirect('http://localhost:5173');
})

router.get('/', async function (req, res, next) {
    console.log(user);
    if (user) {
        return res.jsend.success({ user: user, authenticated: true });
    }
    else return res.jsend.fail({ user: 'none', authenticated: false });
})

router.get('/logout', async function (req, res, next) {
    try {
        await req.session.destroy(() => {
                user = null;
                return res.jsend.success({ message: 'Successfully logged out!' });
        });
    
    } catch (error) {
        console.log(error);
        return res.jsend.fail({ message: error });
    }

})

module.exports = router;