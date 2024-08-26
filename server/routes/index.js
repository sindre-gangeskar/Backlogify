require('dotenv').config();
var express = require('express');
var router = express.Router();

const asyncHandler = require('../javascripts/asyncHandler');

const SteamLibraryService = require('../services/SteamLibraryService');
const steamLibraryService = new SteamLibraryService();

const path = require('path');
const backlogDirPath = path.join(__dirname, '..', 'data', 'backlog');

router.get('/library/gameDetails/:appid', asyncHandler(async function (req, res, next) {
  const { appid } = req.params.appid;
  const data = await steamLibraryService.getGameDetails(req.params.appid);

  return res.status(200).jsend.success({
    statusCode: 200, result: {
      data: data
    }
  })
}))

router.get(`/library/:steamid`, asyncHandler(async function (req, res, next) {
  const games = await steamLibraryService.getOwnedGames(req.params.steamid);
  const backlog = await steamLibraryService.parseBacklog(req.params.steamid, backlogDirPath);
  const filtered = await steamLibraryService.mapGames(games, backlog)
  return res.status(200).jsend.success({ appids: filtered });
}));

router.get('/backlog/:steamid', asyncHandler(async function (req, res, next) {
  const backlog = await steamLibraryService.parseBacklog(req.params.steamid, backlogDirPath);
  return res.status(200).jsend.success({ message: 'Successfully retrieved backlog', appids: backlog.appids })
}))

router.get('/achievements/:steamid/:appid', asyncHandler(async function (req, res, next) {
  const data = await steamLibraryService.retrieveAchievements(req.params.appid, req.params.steamid);
  return res.status(200).jsend.success({ achievements: data.achievements, achieved: data.achieved, icons: data.icons });
}))

router.post('/backlog', asyncHandler(async function (req, res, next) {
  const { name, appid, steamid } = req.body;

  await steamLibraryService.saveGame(steamid, appid, backlogDirPath, req.body);
  return res.status(200).jsend.success({ statusCode: 200, result: { message: `Added ${name} to backlog`, data: { name, appid } } });
}))

router.delete('/backlog', asyncHandler(async function (req, res, next) {
  const { appid, steamid } = req.body;
  await steamLibraryService.deleteGame(steamid, appid, backlogDirPath);
  return res.jsend.success({ data: { appid }, message: 'Successfully removed game from backlog' });
}))

router.delete('/backlog/account', asyncHandler(async function (req, res, next) {
  const { steamid } = req.body;
  await steamLibraryService.deleteBacklog(steamid, backlogDirPath);
  return res.status(200).jsend.success({ statusCode: 200, result: { message: 'Successfully deleted account data' } });
}))
module.exports = router;
