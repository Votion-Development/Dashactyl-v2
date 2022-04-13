import { createHash } from 'crypto';
import { FastifyInstance } from 'fastify';
import db from '../database';
import panel from '../panel';
import { SessionType } from '../structures';

export default (api: FastifyInstance, done: (err?: Error | undefined) => void) => {
    api.post('/auth/login', async (request, reply) => {
        const email = (request.body as { [key: string]: string }).email;
        const password = (request.body as { [key: string]: string }).password;
        if (!email || !password) return reply.redirect('/auth/login?err=MISSINGCREDS');

        const user = await db.accounts.get(email).catch(null);
        if (!user) return reply.redirect('/auth/login?err=NOACCOUNT');

        const hashed = createHash('sha256')
            .update(password)
            .digest()
            .toString();

        if (hashed !== user.password) return reply.redirect('/auth/login?err=INVALIDPASS');
        request.session.set('account', {
            user,
            servers: [],
            type: SessionType.Returning,
            isAdmin: true
        });
        return reply.redirect('/dashboard');
    });

    api.post('/auth/signup', async (request, reply) => {
        const username = (request.body as { [key: string]: string }).username;
        const email = (request.body as { [key: string]: string }).email;
        const password = (request.body as { [key: string]: string }).password;
        if (!username || !email || !password)
            return reply.redirect('/auth/login?err=MISSINGCREDS');

        const userAcc = await db.accounts.create(username, email, password).catch(null);
        if (!userAcc) return reply.redirect('/auth/login?err=ACCEXISTS');

        const panelAcc = await panel.fetchOrCreateUser(username, email, password);
        request.session.set('account', {
            user: userAcc,
            servers: [],
            type: SessionType.NewAccount,
            isAdmin: panelAcc.root_admin
        });
        return reply.redirect('/dashboard');
    });

    // api.get('/auth/discord', async (request, reply) => {});

    done();
}
