import { strict as assert } from 'assert';
import HttpError from './custom-error';

const retriveSession = (sid, store) => {
	assert.ok(sid, 'sid must be required');
	assert.ok(store, 'store must be required');

	return new Promise((resolve, reject) => {
		store.get(sid, (err, result) => {
			if (err) reject(err);
			resolve(result);
		});
	});
};

export default () => async (req, res, next) => {
	// https://github.com/expressjs/session/blob/v1.17.3/session/session.js#L72
	const { sessionStore: store } = req;

	try {
		const session = await retriveSession(req.token, store);
		if (!session || !session.userId) throw new HttpError(401, `invalid session`);

		req.tokens = { userId: session.userId || null };
		next();
	} catch (e) {
		res.status(500).error(e);
	}
};
