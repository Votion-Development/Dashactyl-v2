import { readFileSync } from 'fs';
import { join } from 'path';
import { parse } from 'yaml';

export interface BaseSettings {
    port:           number;
    debug:          boolean;
    secret:         string;
    pterodactyl:{
        url:        string;
        key:        string;
    }
    database:{
        uri:        string;
        name:       string;
    }
    discord:{
        id:         string;
        secret:     string;
        token:      string;
        callback:   string;
        guildId:    string | null;
        invite:     string | null;
    }
}

export default function load(): BaseSettings {
    return parse(
        readFileSync(join(__dirname, '../settings.yml'), { encoding: 'utf-8' })
    );
}
