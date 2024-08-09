require('dotenv').config();
var express = require('express');
var router = express.Router();
const jsend = require('jsend');
const { getOwnedGames, parseJSON, saveJSON, mapGamesJSON, checkJsonExists, deleteJSON } = require('../javascripts/custom');
const path = require('path');
const fs = require('fs');
const backlogDirPath = path.join(__dirname, '..', 'data', 'backlog');

router.use(jsend.middleware);
router.get(`/overview/:steamid`, async function (req, res, next) {
  const id = req.params.steamid;

  try {
    const backlogExists = checkJsonExists(id, backlogDirPath);
    const backlogJson = backlogExists ? parseJSON(id, backlogDirPath) : null;

    const data = await getOwnedGames(id);
    if (data.response.games && data.response.games.length > 0) {

      const filtered = mapGamesJSON(data.response.games, backlogJson)
      return res.jsend.success({ appids: filtered });
    } else return res.jsend.success({ appids: [], message: 'Please set your Steam account profile games visibility to public' });

  } catch (error) {
    return res.jsend.fail({ message: `Could not find games associated with steam id: ${id}`, appids: [] });
  }

});

router.get('/backlog/:steamid', async function (req, res, next) {
  const id = req.params.steamid;
  try {
    const exists = checkJsonExists(id, backlogDirPath);

    if (exists) {
      const data = parseJSON(id, backlogDirPath);
      return res.jsend.success({ appids: data });
    }
    else {
      res.jsend.fail({ data: 'Could not find games associates with steam id' });
    }
  } catch (error) {
    return res.jsend.error({ message: 'something went wrong: ' + error });
  }
})

router.get('/achievements/:steamid/:appid', async function (req, res, next) {
  try {
    const { steamid, appid } = req.params;
    const response = await fetch(`http://api.steampowered.com/ISteamUserStats/GetPlayerAchievements/v0001/?appid=${appid}&key=${process.env.STEAM_API_KEY}&steamid=${steamid}&l=en`)

    if (response.ok) {
      const data = await response.json();

      if (data.playerstats.achievements) {
        const achievements = data.playerstats.achievements;
        const achieved = achievements.filter(x => x.achieved === 1);
        return res.jsend.success({ achievements: achievements, achieved: achieved });
      }
    } else {
      return res.jsend.success({ message: 'No achievements currently exist for selected game' });
    }
  } catch (error) {
    console.log(error);
  }
})

router.post('/backlog', async function (req, res, next) {
  const { name, appid, playtime_forever, steamid } = req.body;
  let data = [];

  const exists = checkJsonExists(steamid, backlogDirPath);
  if (exists) data = parseJSON(steamid, backlogDirPath);

  const app = data.some(app => app.appid === +appid)

  if (app) return res.jsend.success({ data: app, message: 'Game already exists in backlog' });

  await data.push({ name: name, appid: +appid, playtime_forever: +playtime_forever, backlogged: true });
  saveJSON(steamid, backlogDirPath, data);
  return res.jsend.success({ data: { name, appid }, message: 'Added game to backlog' });
})

router.delete('/backlog', async function (req, res, next) {
  const { appid, steamid } = req.body;
  try {
    const exists = checkJsonExists(steamid, backlogDirPath)
    if (exists) {
      const data = parseJSON(steamid, backlogDirPath);
      const dataToKeep = data.filter(x => +x.appid !== +appid);
      saveJSON(steamid, backlogDirPath, dataToKeep);
      console.log(fs.readdirSync(path.join(__dirname, '..', 'data', 'backlog')));
      return res.jsend.success({ data: { appid }, message: 'Successfully removed game from backlog' });
    }

    else return res.jsend.fail({ data: null, message: 'No backlog for current user exists' });
  } catch (error) {
    return res.jsend.fail({ data: { error: error, message: error.statusText } });
  }
})

router.delete('/backlog/account', async function (req, res, next) {
  const { steamid } = req.body;
  const exists = checkJsonExists(steamid, backlogDirPath);
  if (exists) {
    await deleteJSON(steamid, backlogDirPath);
    console.log('Successful deletion of account!')    
  }
  else console.log(`No backlog exists for steam user: ${steamid}. Forcing a log-out`)

  return res.end();
})
module.exports = router;
