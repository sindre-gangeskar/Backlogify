require('dotenv').config();
var express = require('express');
var router = express.Router();
const jsend = require('jsend');
const { getOwnedGames } = require('../public/js/custom');
const path = require('path');
const fs = require('fs');

router.use(jsend.middleware);
router.get('/', async function (req, res, next) {
  const id = "76561198014858853";
  var apps = [];

  const exists = fs.existsSync(path.resolve(__dirname, `../data/${id}.json`));
  if (exists) {
    const data = JSON.parse(fs.readFileSync(path.resolve(__dirname, `../data/${id}.json`), 'utf-8'));
    return res.jsend.success({ appids: data });
  }
  else
    try {
      const data = await getOwnedGames(id);
      data.response.games.forEach(app => {
        if (app) {
          apps.push(app);
        }
      })

      const savePromise = new Promise((resolve, reject) => {
        resolve(fs.writeFileSync(path.resolve(__dirname, `../data/${id}.json`), JSON.stringify(apps, null, 2)));
      })

      await savePromise
        .then(() => {
          const data = fs.readFileSync(path.resolve(__dirname, `../data/${id}.json`))
          return res.jsend.success({ appids: JSON.parse(data) });
        })
      
    } catch (error) {
      return res.jsend.fail(error);
    }

});

module.exports = router;
