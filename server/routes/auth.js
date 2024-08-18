const express = require('express');
const router = express.Router();
const SteamAuthService = require('../services/SteamAuthService')
const steamAuthService = new SteamAuthService();
const asyncHandler = require('../javascripts/asyncHandler');

router.get('/login', asyncHandler(async function (req, res, next) {
    try {
        await steamAuthService.login(req, res, next);
    } catch (error) {
        next(error);
    }
}));
router.get('/login/authenticated', asyncHandler(async function (req, res, next) {
    await steamAuthService.setAuthentication(req, res, next);
}));
router.get('/', asyncHandler(async function (req, res, next) {
    const session = await steamAuthService.fetchSession(req, res, next);
    return res.jsend.success(session);
}));
router.get('/logout', asyncHandler(async function (req, res, next) {
    await steamAuthService.logout(req, res, next)
}));

module.exports = router;