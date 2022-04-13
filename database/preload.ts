import { MongoClient } from 'mongodb';
import defaults from './defaults';
import log from '../logger';

const COLLECTIONS = [
    'sessions', 'settings', 'users',
    'coupons', 'packages', 'eggs',
    'blacklist', 'keys'
]

export default async function preload(cursor: MongoClient, dbName: string): Promise<void> {
    const db = cursor.db(dbName);

    for (const coll of COLLECTIONS) {
        db.listCollections({ name: coll }).next((_, data) => {
            if (data) return;

            db.createCollection(coll, async (err, doc) => {
                if (err) return log.error(err.message);
                if (coll === 'eggs') await doc!.insertOne(defaults.getDefaultEgg());
                if (coll === 'packages') await doc!.insertOne(defaults.getDefaultPackage());
                log.success(`Created the '${coll}' collection`);
            });
        });
    }
}
