import { FastifyInstance } from 'fastify';
// import db from '../../database';
// import { APIKey } from '../../helpers/structs';
import userControl from './users';

export default (api: FastifyInstance, done: (err?: Error | undefined) => void) => {
    api.addHook('preHandler', async request => {
        // TODO: add origin check
    });

    api.setErrorHandler((err, _, reply) => {
        reply.send({ status: 'error', error: err.message });
    });

    api.register(
        (api, _, done) => userControl(api, done),
        { prefix: '/api' }
    );

    done();
}
