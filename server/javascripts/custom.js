require('dotenv').config();
const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');

async function getOwnedGames(id) {
    const response = await fetch(`${process.env.BASEURL}/${process.env.OWNEDGAMESURL}/?key=${process.env.KEY}&steamid=${id}&format=json&include_appinfo=true`);
    try {
        if (response.ok) {
            const data = await response.json();
            return data;
        }
        else return { message: 'Could find games associated with steam id' }
    } catch (error) {
        return error;
    }

}
function parseJSON(filename, filepath) {
    try {
        const data = JSON.parse(fs.readFileSync(path.resolve(__dirname, `${filepath}\\${filename}.json`), 'utf-8'));
        return data;
    } catch (error) {
        console.error('Failed to parse json', error);
    }
}
function saveJSON(filename, savepath, data) {
    try {
        console.log('Saved JSON file successfully');
        fs.writeFileSync(path.resolve(__dirname, savepath + "\\" + filename + ".json"), JSON.stringify(data, null, 2));
    } catch (error) {
        console.error('Failed to save json:', error);
    }
}

function deleteJSON(steamid, pathToFile) {
    if (pathToFile)
        fs.unlinkSync(path.resolve(__dirname, pathToFile));
    else console.log(`No backlog exists for: ${steamid}. Forcing a logout`);
}

function checkJsonExists(filename, filepath) {
    return fs.existsSync(path.resolve(__dirname, `${filepath}\\${filename}.json`));
}
function mapGamesJSON(arr = [], backlog = null) {
    if (!arr) throw new Error('The "arr" parameter is required');
    if (!Array.isArray(arr)) {
        console.error('Data passed is not of type array');
        return;
    }
    return arr.map(app => ({
        appid: app.appid,
        name: app.name,
        playtime_forever: app.playtime_forever,
        img_icon_url: app.img_icon_url,
        backlogged: backlog?.some(x => x.appid === +app.appid) ? true : false
    }))
}

module.exports = { getOwnedGames, parseJSON, saveJSON, mapGamesJSON, checkJsonExists, deleteJSON };