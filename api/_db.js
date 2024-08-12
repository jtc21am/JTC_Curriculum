const { MongoClient } = require('mongodb');

let cachedClient = null;
let cachedDb = null;

async function connectToDatabase() {
    if (cachedClient && cachedDb) {
        return { client: cachedClient, db: cachedDb };
    }

    const client = new MongoClient(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    if (!cachedClient) {
        cachedClient = await client.connect();
    }

    const db = cachedClient.db(process.env.MONGODB_DB);
    cachedDb = db;

    return { client: cachedClient, db: cachedDb };
}

module.exports = { connectToDatabase };
