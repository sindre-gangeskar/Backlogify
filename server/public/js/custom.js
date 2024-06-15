require('dotenv').config();
const fetch = require('node-fetch');

async function getOwnedGames(id) {
    const response = await fetch(`${process.env.BASEURL}/${process.env.OWNEDGAMESURL}/?key=${process.env.KEY}&steamid=${id}&format=json&include_appinfo=true`);
    try {
        if (response.ok) {
            const data = await response.json();
            return data;
        }
        else return response.message;
    } catch (error) {
        return error;
    }

}

module.exports = { getOwnedGames };