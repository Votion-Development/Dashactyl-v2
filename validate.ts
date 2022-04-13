import * as assert from 'assert';
import type { BaseSettings } from './structures/settings';

export default function (data: BaseSettings): void {
    assert.strictEqual(typeof data.port, 'number', 'Port must be a number.');
    assert.ok(data.port >= 1000, 'Port must be greater than or equal to 1000.');
    assert.ok(data.port <= 9000, 'Port must be less than or equal to 9000.');

    assert.strictEqual(typeof data.debug, 'boolean', 'Debug must be a boolean (true/false).');

    assert.ok(data.secret.length >= 32, 'App secret must be greater than or equal to 32 characters length.');

    assert.strictEqual(typeof data.pterodactyl.url, 'string', 'Pterodactyl URL must be a string.');
    assert.match(
        data.pterodactyl.url,
        /https:\/\/(?:[a-z0-9\.\-]+){2,256}/gi,
        'Pterodactyl domain must be a valid domain (not localhost or an IP).'
    );
    assert.strictEqual(typeof data.pterodactyl.key, 'string', 'Pterodactyl API key must be a string.');
    assert.ok(data.pterodactyl.key.length >= 30, 'Pterodactyl API key is invalid.');

    assert.strictEqual(typeof data.database.uri, 'string', 'Database URI must be a string.');
    assert.ok(data.database.uri.startsWith('mongodb+srv'), 'Database URI is invalid.');
    assert.strictEqual(typeof data.database.name, 'string', 'Database name must be a string.');
    assert.ok(data.database.name.length >= 3, 'Database name is invalid.');

    assert.equal(typeof data.discord.id, 'string', 'Discord application ID must be a string number.');
    assert.match(data.discord.id, /\d{17,19}/g, 'Discord application ID is invalid.');
    assert.strictEqual(typeof data.discord.secret, 'string', 'Discord application secret must be a string.');
    assert.ok(data.discord.secret.length >= 30, 'Discord application secret is invalid.');
    assert.strictEqual(typeof data.discord.token, 'string', 'Discord application token must be a string.');
    assert.ok(data.discord.token.length >= 50, 'Discord application token is invalid.');
    if (data.discord.guildId) {
        assert.match(data.discord.guildId, /\d{17,19}/g, 'Discord guild ID is invalid.');
    }
}
