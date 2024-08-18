const axios = require('axios');
const SteamSignIn = require('steam-signin');
const steamSignIn = new SteamSignIn(process.env.STEAM_SERVER_REALM);

class SteamAuthService {
    async login(req, res, next) {
        try {
            res.statusCode = 302;
            const redirectUrl = steamSignIn.getUrl(`${process.env.STEAM_SERVER_REALM}/auth/login/authenticated`);
            res.redirect(redirectUrl);
        } catch (error) {
            error.statusCode = 500;
            error.name = 'SteamLoginError';
            throw error;
        }
    }
    async setAuthentication(req, res, next) {
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
                    res.redirect(`${process.env.NODE_ENV !== 'dev' ? process.env.BACKLOGIFY_CLIENT_BASE_URL : process.env.DEVELOPMENT_URL}`);
                })
            })
        } catch (error) {
            console.error('Error during authentication:', error);
            return res.status(500).send('An internal server error has occurred while getting steam data. Please try again later');
        }
    }
    async fetchSession(req, res, next) {
        try {
            const user = req.session.user || null;
            const userObj = {
                user: user, authenticated: !!user
            }
            return userObj;
        } catch (error) {
            console.error(error);
            error.statusCode = 500;
            error.message = 'An internal server error has occurred during authentication. Please try again later'
            throw error;
        }
    }
    async logout(req, res, next) {
        try {
            await new Promise((resolve, reject) => {
                req.session.destroy(err => {
                    if (err) {
                        console.error(err);
                        const sessionError = new Error('An internal server error has occurred while trying to log out.');
                        sessionError.statusCode = 500;
                        sessionError.name = 'SessionDestroyError';
                        return reject(sessionError);
                    }
                    res.clearCookie('connect.sid', { domain: process.env.NODE_ENV !== 'dev' ? process.env.BACKLOGIFY_CLIENT_BASE_URL : process.env.DEVELOPMENT_URL, path: '/' });
                    resolve(true);
                })
            })
            res.status(200).jsend.success({ statusCode: 200, result: { message: 'Successfully logged out' } });
        } catch (error) {
            console.error(error);
            next(error);
        }
    }
}


module.exports = SteamAuthService;