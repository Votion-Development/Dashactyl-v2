import db, { init } from '../database';
import load from '../structures/settings';
import log from '../logger';
import validate from '../validate';

(async (args: string[]) => {
    if (!args[0]) log.fatal('usage: set-root <email>');
    if (!/[a-z0-9\.\-\~]+@[a-z0-9\.\-]+/g.test(args[0]))
        log.fatal('invalid email provided for root');

    try {
        const base = load();
        validate(base);
        await init();

        const settings = await db.settings.get();
        const account = await db.accounts.get(args[0]);
        if (!account) log.fatal([
            'an account with that email could not be found',
            "use 'npm run create-root ...' to setup a new root account"
        ]);

        settings.root = args[0];
        await db.settings.update(settings);
        log.success('root account updated');
    } catch (err) {
        log.fatal((err as Error).message);
    }
})(process.argv.slice(2));
