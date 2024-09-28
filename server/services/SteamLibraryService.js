const fs = require('fs');
const fetch = require('node-fetch');
class SteamLibraryService {
    async getOwnedGames(id) {
        const response = await fetch(`${process.env.STEAM_API_BASE_URL}/${process.env.STEAM_API_OWNEDGAMES_URL}/?key=${process.env.STEAM_API_KEY}&steamid=${id}&format=json&include_appinfo=true`);
        try {
            if (response.ok) {
                const data = await response.json();
                console.log(data);
                return data.response.games;
            }
            else return { message: 'Could find games associated with steam id' }
        } catch (error) {
            console.error(error);
            const userError = new Error('An internal server error has occurred while attemping to fetch games from your steam account. Please try again later');
            throw userError;
        }
    }
    async retrieveAchievements(appid, steamid) {
        try {
            const achievementResponse = await fetch(`http://api.steampowered.com/ISteamUserStats/GetSchemaForGame/v2/?key=${process.env.STEAM_API_KEY}&appid=${appid}&l=en&format=json`);
            const response = await fetch(`http://api.steampowered.com/ISteamUserStats/GetPlayerAchievements/v0001/?appid=${appid}&key=${process.env.STEAM_API_KEY}&steamid=${steamid}&l=en`)

            if (response.ok && achievementResponse.ok) {
                const data = await response.json();
                const achievementData = await achievementResponse.json();
                const details = achievementData.game.availableGameStats.achievements;

                const icons = details?.map(detail => ({
                    icon: detail.icon,
                    icongray: detail.icongray,
                    description: detail.description
                }));

                if (data.playerstats.achievements) {
                    const achievements = data.playerstats.achievements;
                    const achieved = achievements.filter(x => x.achieved === 1);

                    return { achievements: achievements, achieved: achieved, icons: icons };
                }
                else return { achievements: [], achieved: [], icons: icons };
            }
        } catch (error) {
            console.error(error);
            const userError = new Error('An internal server error has occurred while trying to fetch achievements. Please try again later');
            userError.statusCode = 500;
            userError.name = 'FetchAchievementsError'
            throw userError;
        }
    }
    async getGameDetails(appid) {
        try {
            const response = await fetch(`https://store.steampowered.com/api/appdetails?appids=${appid}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
            })

            if (response.ok) {
                const data = await response.json();
                console.log(data[ `${appid}` ].data)
                if (data) return data[ `${appid}` ].data;
                else {
                    const notFoundError = new Error('Cannot find data for specified appid');
                    notFoundError.name = 'GameDetailsNotFoundError';
                    notFoundError.statusCode = 404;
                    throw notFoundError;
                }
            }

        } catch (error) {
            if (error.statusCode == 404) throw error;
            else throw error;
        }
    }
    mapGames(gamesArr, backlog) {
        return gamesArr.map(app => ({
            appid: app.appid,
            name: app.name,
            playtime_forever: app.playtime_forever,
            img_icon_url: app.img_icon_url,
            backlogged: backlog.some(x => +x.appid === +app.appid) ? true : false
        }))
    }
}

module.exports = SteamLibraryService;