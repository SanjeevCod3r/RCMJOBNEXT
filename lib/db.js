import { MongoClient } from 'mongodb';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

const uri = process.env.MONGO_URL;
const dbName = process.env.DB_NAME || 'jobportal_db';

const DEFAULT_ADMIN_EMAIL = 'admin@careerconnect.com';
const DEFAULT_ADMIN_PASSWORD = 'admin123';

let cachedClient = null;
let cachedDb = null;

async function seedAdmin(db) {
  const existing = await db.collection('users').findOne({ email: DEFAULT_ADMIN_EMAIL });
  if (existing) {
    // Ensure role is ADMIN even if someone tampered
    if (existing.role !== 'ADMIN') {
      await db.collection('users').updateOne({ email: DEFAULT_ADMIN_EMAIL }, { $set: { role: 'ADMIN', isPremium: true } });
    }
    return;
  }
  await db.collection('users').insertOne({
    id: uuidv4(),
    name: 'Super Admin',
    email: DEFAULT_ADMIN_EMAIL,
    password: await bcrypt.hash(DEFAULT_ADMIN_PASSWORD, 10),
    role: 'ADMIN',
    isPremium: true,
    createdAt: new Date(),
  });
  console.log('[seed] Default admin created:', DEFAULT_ADMIN_EMAIL, '/', DEFAULT_ADMIN_PASSWORD);
}

export async function getDb() {
  if (cachedDb) return cachedDb;
  if (!cachedClient) {
    cachedClient = new MongoClient(uri);
    await cachedClient.connect();
  }
  cachedDb = cachedClient.db(dbName);
  try {
    await cachedDb.collection('users').createIndex({ email: 1 }, { unique: true });
    await cachedDb.collection('jobs').createIndex({ createdAt: -1 });
    await cachedDb.collection('applications').createIndex({ jobId: 1, candidateId: 1 }, { unique: true });
    await seedAdmin(cachedDb);
  } catch (e) { console.error('[db init]', e?.message); }
  return cachedDb;
}
