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
    async saveBacklog(filename, savepath, data) {
        try {
            await fs.promises.writeFile(`${savepath}/${filename}.json`, JSON.stringify(data, null, 2));
            console.log('Saved JSON backlog successfully');

        } catch (error) {
            console.error('Failed to save backlog:', error);
            error.statusCode = 500;
            error.message = 'An internal server error has occurred while trying to save backlog'
            error.name = 'SaveBacklogError'
            throw error;
        }
    }
    async deleteBacklog(steamid, pathToFileDir) {
        try {
            await fs.promises.unlink(`${pathToFileDir}/${steamid}.json`);
            return { message: 'Successfully deleted backlog' };
        } catch (error) {
            console.error(`No backlog exists for: ${steamid}. Forcing a logout`, error);
            const notFoundError = new Error('No backlog found with specified steam id');
            notFoundError.statusCode = 404;
            notFoundError.name = 'BacklogNotFoundError';
            throw notFoundError;
        }
    }
    async deleteGame(steamid, appid, backlogDirPath) {
        try {
            const data = await this.parseBacklog(steamid, backlogDirPath);
            const dataToKeep = data.appids.filter(x => +x.appid !== +appid);

            await this.saveBacklog(steamid, backlogDirPath, { appids: dataToKeep });
        } catch (error) {
            console.error(error);
            const userError = new Error('An internal server error has occurred while trying to delete game from backlog. Please try again later');
            userError.statusCode = 500;
            userError.name = 'BacklogDeletGameError';
            throw userError;
        }
    }
    async saveGame(steamid, appid, backlogDirPath, body) {
        const backlog = await this.parseBacklog(steamid, backlogDirPath);
        const app = backlog.appids.some(app => app.appid === appid)

        const game = { name: body.name, appid: body.appid, playtime_forever: body.playtime_forever, backlogged: true };

        if (app) {
            const duplicateError = new Error('The game already exists in the backlog');
            duplicateError.statusCode = 409;
            duplicateError.name = 'BacklogDuplicateEntryError';
            throw duplicateError;
        }
        else {
            backlog.appids.push(game);
            await this.saveBacklog(steamid, backlogDirPath, backlog);
        }
    }
    async checkBacklogExists(filename, filepath) {
        try {
            const exists = fs.existsSync(`${filepath}/${filename}.json`);
            return exists;
        } catch (error) {
            console.error(error);
            error.statusCode = 500;
            error.message = 'An internal server error has occurred while trying attempting to access the backlog. Please try again later';
            error.name = 'BacklogInternalServerError';
            throw error;
        }
    }
    async parseBacklog(filename, filepath) {
        try {
            const exists = await this.checkBacklogExists(filename, filepath)
            if (exists) {
                const data = await JSON.parse(fs.readFileSync(`${filepath}/${filename}.json`), 'utf-8');
                return data;
            }
            else {
                await this.createBacklog(filename, filepath);
                await this.saveBacklog(filename, filepath, { appids: [] });
                const data = await JSON.parse(fs.readFileSync(`${filepath}/${filename}.json`), 'utf-8');
                return data;
            };
        } catch (error) {
            console.error('Failed to parse json', error);
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
    async createBacklog(steamid, backlogDirPath) {
        const exists = await this.checkBacklogExists(steamid, backlogDirPath);
        if (exists) return;

        if (!exists && steamid !== null) await this.saveBacklog(steamid, backlogDirPath, { appids: [] })
        else return;
    }
    mapGames(gamesArr, backlog) {
        return gamesArr.map(app => ({
            appid: app.appid,
            name: app.name,
            playtime_forever: app.playtime_forever,
            img_icon_url: app.img_icon_url,
            backlogged: backlog.appids.some(x => +x.appid === +app.appid) ? true : false
        }))
    }
}

module.exports = SteamLibraryService;