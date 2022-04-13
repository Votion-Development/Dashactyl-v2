import { FastifyInstance } from 'fastify';
import { Session } from '../structures';

export default (api: FastifyInstance, done: (err?: Error | undefined) => void) => {
    api.setNotFoundHandler((_, reply) => {
        reply.view('errors.ejs', {
            code: 404,
            message: null
        });
    });

    api.get('/', (request, reply) => {
        reply.view('home.ejs', {});
    });

    api.get('/login', (request, reply) => {
        const session = request.session.get<Session>('account');
        // TODO: valid check here too
        if (session) {
            reply.redirect('/dashboard');
        } else {
            reply.view('login.ejs', {});
        }
    });

    api.get('/signup', (request, reply) => {
        const session = request.session.get<Session>('account');
        // TODO: valid check here too
        if (session) {
            reply.redirect('/dashboard');
        } else {
            reply.view('signup.ejs', {});
        }
    });

    api.get('/logout', (request, reply) => {
        return request.destroySession(() => reply.redirect('/'));
    });

    api.get('*', (request, reply) => {
        const session = request.session.get<Session>('account') as Session | undefined;
        if (!session) {
            reply.view('login.ejs', {});
        } else {
            const page = PAGES[request.url.split('?')[0]];
            if (!page) return reply.callNotFound();
            reply.view(page, { session });
        }
    });

    done();
}

const PAGES: { [key: string]: string } = {
    '/dashboard': 'dashboard.ejs',
    '/earn/redeem': 'redeem.ejs',
    '/earn/afk': 'afk.ejs'
};
