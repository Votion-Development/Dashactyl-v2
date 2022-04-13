import { FastifyInstance } from 'fastify';
import db from '../../database';

export default (api: FastifyInstance, done: (err?: Error | undefined) => void) => {
    api.get('/', async (_, reply) => {
        let users = (await db.accounts.fetch()).map(copyWithoutId);
        return reply.send({ status: 'success', data: users });
    });

    api.get('/:email', async (request, reply) => {
        const user = await db.accounts.get(
            (request.headers as { [key: string]: string }).email
        );
        return reply.send({ status: 'success', data: copyWithoutId(user!) });
    });

    done();
}

function copyWithoutId(model: object): object {
    return Object.entries(model)
        .filter(([k],) => k !== '_id')
        .reduce((a, e) => a[e[0]] = e[1], {} as { [key: string]: any });
}
