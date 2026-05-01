import { MongoClient } from 'mongodb';

const uri = process.env.MONGO_URL;
const dbName = process.env.DB_NAME || 'jobportal_db';

let cachedClient = null;
let cachedDb = null;

export async function getDb() {
  if (cachedDb) return cachedDb;
  if (!cachedClient) {
    cachedClient = new MongoClient(uri);
    await cachedClient.connect();
  }
  cachedDb = cachedClient.db(dbName);
  // Ensure indexes
  try {
    await cachedDb.collection('users').createIndex({ email: 1 }, { unique: true });
    await cachedDb.collection('jobs').createIndex({ createdAt: -1 });
    await cachedDb.collection('applications').createIndex({ jobId: 1, candidateId: 1 }, { unique: true });
  } catch (e) {}
  return cachedDb;
}
