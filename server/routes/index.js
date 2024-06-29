require('dotenv').config();
var express = require('express');
var router = express.Router();
const jsend = require('jsend');
const { getOwnedGames } = require('../public/js/custom');
const path = require('path');
const fs = require('fs');

router.use(jsend.middleware);
router.get('/:steamid', async function (req, res, next) {
  const backlogPath = path.resolve(__dirname, '../data/backlog');
  if (!backlogPath)
    fs.mkdirSync(path.resolve(__dirname, '../data/backlog'));

  const id = req.params.steamid;

  try {
    const exists = fs.existsSync(path.resolve(__dirname, `../data/${id}.json`));
    const backlogExists = fs.existsSync(path.resolve(__dirname, `../data/backlog/${id}.json`));
    let backlog;

    if (exists) {
      const data = JSON.parse(fs.readFileSync(path.resolve(__dirname, `../data/${id}.json`), 'utf-8'));

      if (backlogExists) {
        backlog = JSON.parse(fs.readFileSync(path.resolve(__dirname, `../data/backlog/${id}.json`)));

        const updated = data.map(app => ({
          appid: app.appid,
          name: app.name,
          playtime_forever: app.playtime_forever,
          img_icon_url: app.img_icon_url,
          backlogged: backlog?.some(x => x.appid === +app.appid) ? true : false
        }))
        fs.writeFileSync(path.resolve(__dirname, `../data/${id}.json`), JSON.stringify(updated, null, 2));
        return res.jsend.success({ appids: updated });
      }
      return res.jsend.success({ appids: data });
    }

    const data = await getOwnedGames(id);

    if (data.response.games && data.response.games.length > 0) {
      const filtered = data.response.games.map(app => ({
        appid: app.appid,
        name: app.name,
        playtime_forever: app.playtime_forever,
        img_icon_url: app.img_icon_url,
        backlogged: backlog?.some(x => x.appid === +app.appid) ? true : false
      }))

      fs.writeFileSync(path.resolve(__dirname, `../data/${id}.json`), JSON.stringify(filtered, null, 2));
      const saved = fs.readFileSync(path.resolve(__dirname, `../data/${id}.json`))
      return res.jsend.success({ appids: JSON.parse(saved) });
    } else return res.jsend.success({ appids: [], message: 'ASDSADA' });

  } catch (error) {
    return res.jsend.fail({ message: `Could not find games associated with steam id: ${id}`, appids: []});
  }

});

router.get('/backlog/:steamid', async function (req, res, next) {
  const id = req.params.steamid;
  try {
    const exists = fs.existsSync(path.resolve(__dirname, `../data/backlog/${id}.json`));

    if (exists) {
      const data = JSON.parse(fs.readFileSync(path.resolve(__dirname, `../data/backlog/${id}.json`), 'utf-8'));
      return res.jsend.success({ appids: data });
    }
    else {
      res.jsend.fail({ data: 'Could not find games associates with steam id' });
    }
  } catch (error) {
    return res.jsend.error({ message: 'something went wrong' });
  }
})

router.post('/backlog', async function (req, res, next) {
  const { name, appid, playtime_forever, steamid } = req.body;
  let data = [];

  const exists = fs.existsSync(path.resolve(__dirname, `../data/backlog/${steamid}.json`));
  if (exists)
    data = JSON.parse(fs.readFileSync(path.resolve(__dirname, `../data/backlog/${steamid}.json`)));

  const app = data.some(app => app.appid === +appid)
  if (app) {
    console.log('Game already exists in backlog');
    return res.jsend.success({ data: app, message: 'Game already exists in backlog' });
  }

  await data.push({ name: name, appid: +appid, playtime_forever: +playtime_forever, backlogged: true });
  fs.writeFileSync(path.resolve(__dirname, `../data/backlog/${steamid}.json`), JSON.stringify(data, null, 2));
  return res.jsend.success({ data: { name, appid }, message: 'Added game to backlog' });
})

router.delete('/backlog', async function (req, res, next) {
  const { appid, steamid } = req.body;
  try {
    const exists = fs.existsSync(path.resolve(__dirname, `../data/backlog/${steamid}.json`));

    if (exists) {
      const data = JSON.parse(fs.readFileSync(path.resolve(__dirname, `../data/backlog/${steamid}.json`)));
      const dataToKeep = data.filter(x => +x.appid !== +appid);
      fs.writeFileSync(path.resolve(__dirname, `../data/backlog/${steamid}.json`), JSON.stringify(dataToKeep, null, 2));
      return res.jsend.success({ data: { appid }, message: 'Successfully removed game from backlog' });
    }

    else return res.jsend.fail({ data: null, message: 'No backlog for current user exists' });
  } catch (error) {
    return res.jsend.fail({ data: { error: error, message: error.statusText } });
  }
})
module.exports = router;
