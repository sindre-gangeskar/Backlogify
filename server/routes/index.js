require('dotenv').config();
var express = require('express');
var router = express.Router();
const jsend = require('jsend');
const { getOwnedGames } = require('../public/js/custom');
const path = require('path');
const fs = require('fs');

router.use(jsend.middleware);
router.get('/:steamid', async function (req, res, next) {
  const id = req.params.steamid;
  const apps = [];

  try {
    const exists = fs.existsSync(path.resolve(__dirname, `../data/${id}.json`));

    if (exists) {
      const data = JSON.parse(fs.readFileSync(path.resolve(__dirname, `../data/${id}.json`), 'utf-8'));
      return res.jsend.success({ appids: data });
    }

    const data = await getOwnedGames(id);

    if (data) {
      const filtered = data.response.games.map(app => ({
        appid: app.appid,
        name: app.name,
        playtime_forever: app.playtime_forever,
        img_icon_url: app.img_icon_url
      }))

      fs.writeFileSync(path.resolve(__dirname, `../data/${id}.json`), JSON.stringify(filtered, null, 2));
      const saved = fs.readFileSync(path.resolve(__dirname, `../data/${id}.json`))
      return res.jsend.success({ appids: JSON.parse(saved) });
    }

    else {
      res.jsend.fail({ data: 'Could not find games associates with steam id' });
    }

  } catch (error) {
    return res.jsend.error({ message: 'something went wrong' });
  }

});

module.exports = router;
