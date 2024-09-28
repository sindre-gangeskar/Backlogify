require('dotenv').config();
var express = require('express');
var router = express.Router();

const SteamBacklogifyDBService = require('../services/SteamBacklogifyDBService');
const steamDB = new SteamBacklogifyDBService();
const dbName = process.env.MONGODB_NAME;

const asyncHandler = require('../javascripts/asyncHandler');

const SteamLibraryService = require('../services/SteamLibraryService');
const steamLibraryService = new SteamLibraryService();

steamDB.connect().then(() => {
  steamDB.getDb();
})

router.get('/library/gameDetails/:appid', asyncHandler(async function (req, res, next) {
  const data = await steamLibraryService.getGameDetails(req.params.appid);
  return res.status(200).jsend.success({
    statusCode: 200, result: {
      data: data
    }
  })
}))

router.get(`/library/:steamid`, asyncHandler(async function (req, res, next) {
  const games = await steamLibraryService.getOwnedGames(req.params.steamid);
  const backlog = await steamDB.findAllBackloggedItems(req.params.steamid);
  const filtered = await steamLibraryService.mapGames(games, backlog)
  return res.status(200).jsend.success({ appids: filtered });
}));

router.get('/backlog/:steamid', asyncHandler(async function (req, res, next) {
  const backlog = await steamDB.findAllBackloggedItems(req.params.steamid);
  return res.status(200).jsend.success({ message: 'Successfully retrieved backlog', appids: backlog })
}))

router.get('/achievements/:steamid/:appid', asyncHandler(async function (req, res, next) {
  const data = await steamLibraryService.retrieveAchievements(req.params.appid, req.params.steamid);
  return res.status(200).jsend.success({ achievements: data.achievements, achieved: data.achieved, icons: data.icons });
}))

router.post('/backlog', asyncHandler(async function (req, res, next) {
  const { steamid, appid, name, playtime_forever, backlogged } = req.body;
  await steamDB.addToBacklog(steamid, appid, name, playtime_forever, backlogged);
  return res.status(200).jsend.success({
    statusCode: 200, result: {
      message: `Added ${name} to backlog`,
    }
  });
}))

router.delete('/backlog', asyncHandler(async function (req, res, next) {
  const { appid, steamId } = req.body;
  await steamDB.deleteOneFromBacklog(steamId, appid)
  return res.jsend.success({ data: { appid }, message: 'Successfully removed game from backlog' });
}))

router.delete('/backlog/account', asyncHandler(async function (req, res, next) {
  const { steamId } = req.body;
  await steamDB.deleteEntireBacklog(steamId);
  return res.status(200).jsend.success({ statusCode: 200, result: { message: 'Successfully deleted account data' } });
}))
module.exports = router;
