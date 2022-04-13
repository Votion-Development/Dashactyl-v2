import { createHash } from 'crypto';
import { Db, MongoClient } from 'mongodb';
import load from '../structures/settings';
import { Account, Settings } from '../structures';
import defaults from './defaults';
import log from '../logger';
import panel from '../panel';
import preload from './preload';
import { defaultUser } from '../helpers/permissions';

let cursor: Db;

export async function init(): Promise<void> {
    const { debug, database } = load();
    const logDebug = (message: string | string[]) => debug ? log.debug(message) : null;

    log.info('connecting to database...');
    logDebug([
        `uri: ${database.uri}`,
        `cluster: ${database.name}`
    ]);

    const client = await new MongoClient(database.uri).connect();
    logDebug('initial connection established');
    cursor = client.db(database.name);
    logDebug('database opened');

    await preload(client, database.name);
    logDebug('preload complete');
    log.success('connected to database!');
}

export async function getSettings() {
    const data = await cursor.collection<Settings>('settings').findOne();
    if (!data) throw new Error('Settings could not be found.');
    return data;
}

export async function updateSettings(data: Settings) {
    const settings = Object.assign(await getSettings(), data);
    return await cursor.collection<Settings>('settings')
        .findOneAndUpdate({}, { $set: settings });
}

export async function fetchAccounts() {
    return await cursor.collection<Account>('users').find({}).toArray();
}

export async function getAccount(email: string) {
    return await cursor.collection<Account>('users').findOne({ email });
}

export async function createAccount(
    username: string,
    email: string,
    password: string
) {
    const user = await getAccount(email);
    if (user) throw new Error('An account with these credentials already exists.');

    const acc = await panel.fetchOrCreateUser(username, email, password);
    password = createHash('sha256')
        .update(password)
        .digest()
        .toString();

    const data = {
        username,
        email,
        password,
        avatar: '',
        resources: defaults.getDefaultResouces(),
        package: 'default',
        referral: null,
        permissions: defaultUser()
    }

    return await cursor.collection<Account>('users').insertOne(data);
}

export async function updateAccount(email: string, data: Account) {
    let user = await getAccount(email);
    if (!user) throw new Error('No account found with those credentials.');
    user = Object.assign(user, data);
    return await cursor.collection<Account>('users')
        .findOneAndUpdate({ email }, { $set: user });
}

export async function deleteAccount(email: string) {
    const user = await getAccount(email);
    if (!user) throw new Error('No account found with those credentials');
    return await cursor.collection('users')
        .findOneAndDelete({ email });
}

export async function fetchKeys() {
    return await cursor.collection('keys').find({}).toArray();
}

export async function getKey(code: string) {
    return await cursor.collection('keys').findOne({ code });
}

export default {
    accounts:{
        fetch: fetchAccounts,
        get: getAccount,
        create: createAccount,
        update: updateAccount,
        delete: deleteAccount
    },
    settings:{
        get: getSettings,
        update: updateSettings
    },
    keys:{
        fetch: fetchKeys,
        get: getKey
    }
}
