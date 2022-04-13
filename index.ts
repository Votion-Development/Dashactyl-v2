import * as ejs from 'ejs';
import { join } from 'path';
import fastify from 'fastify';
import cookie from 'fastify-cookie';
import session from '@fastify/session';
import formbody from 'fastify-formbody';
import pointOfView from 'point-of-view';
import { init } from './database';
import log from './logger';
import load from './structures/settings';
import routers from './routers';
import validate from './validate';

const app = fastify();
const settings = load();

app.register(cookie);
app.register(session, {
    secret: settings.secret,
    saveUninitialized: true,
    cookie:{
        secure: true
    }
});
app.register(formbody);

app.register(pointOfView, {
    engine: { ejs },
    root: join(__dirname, 'theme')
});

app.register((api, _, done) => routers.general(api, done));
app.register((api, _, done) => routers.auth(api, done));
app.register((api, _, done) => routers.api(api, done));

app.setErrorHandler((err, _, reply) => {
    reply.view('errors.ejs', {
        user: null,
        code: err.code,
        message: err.message
    });
    log.error(err.stack || err.message);
});

(async () => {
    log.info('validating settings...');
    try {
        validate(settings);
        await init();
    } catch (err) {
        log.fatal((err as Error).message);
    }

    app.listen(settings.port, (err, _) => {
        if (err) log.fatal(err.stack || err.message);
        log.success(`listening on http://localhost:${settings.port}`);
    });
})();
