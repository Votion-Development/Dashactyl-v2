import { parse } from 'yaml';
import { join } from 'path';
import { readFileSync } from 'fs';

export interface BaseSettings {
    port: number;
    debug: boolean;
    pterodactyl:{
        url: string;
        key: string;
    }
    database:{
        uri: string;
        name: string;
    }
    discord:{
        id: string;
        secret: string;
        token: string;
        callback: string;
        guildId: string | null;
        invite: string | null;
    }
}

export default function load(): BaseSettings {
    return parse(
        readFileSync(join(__dirname, '../settings.yml'), { encoding: 'utf-8' })
    );
}
// i know but your returning it "as BaseSettings"
// BaseSettings is stuff from settings.yml, Settings will be options saved in the db oh lol