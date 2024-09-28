const { MongoClient } = require('mongodb');
const dbName = 'SteamBacklogifyDB'
let db;


class SteamBacklogifyDBService {
  async connect() {
    try {
      const client = await MongoClient.connect(process.env.MONGODB_CONNECTION_STRING);
      db = client.db(dbName);
      console.log('Successfully connected to: ', dbName);

    } catch (error) {
      console.error(error);
    }
  }

  getDb() {
    if (!db)
      console.error('Cannot find db by name: ', dbName);
    else return db;
  }

  async addToBacklog(steamId, appid, name, playtime_forever) {
    try {
      const db = this.getDb();
      const exists = await db.collection('Backlog').findOne({ steamId: steamId, appid: appid });
      if (exists)
        console.log('Document already exists for current user');
      else {
        await db.collection('Backlog').insertOne({ steamId: steamId, appid, name, playtime_forever, backlogged: true });
        console.log('Successfully added app to backlog db');
      }
    } catch (error) {
      console.error(error);
    }
  }

  async deleteOneFromBacklog(steamId, appId) {
    try {
      const db = this.getDb();
      await db.collection('Backlog').deleteOne({ steamId: steamId, appid: appId })
    } catch (error) {
      console.error(error);
    }
  }

  async findAllBackloggedItems(steamid) {
    try {
      const db = this.getDb();
      return await db.collection('Backlog').find({ steamId: steamid }).toArray();
    } catch (error) {
      console.error(error);
    }
  }

  async deleteEntireBacklog(steamid) {
    const db = this.getDb();
    return await db.collection('Backlog').deleteMany({ steamId: steamid });
  }
}

module.exports = SteamBacklogifyDBService;