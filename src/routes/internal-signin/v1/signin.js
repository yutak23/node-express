import { Router } from 'express';
import { DateTime } from 'luxon';
import snakecaseKeys from 'snakecase-keys';

const router = Router();

router.post('/', async (req, res) => {
	const { session } = req;
	const { models, CustomError } = req.app.locals;
	const { email, password } = req.body;

	try {
		const user = await models.user.findByEmailPassword(email, password);
		if (!user) throw new CustomError(404, 'data not found');

		session.userId = user.id;
		await new Promise((resolve, reject) => {
			session.save((err) => {
				if (err) reject(err);
				resolve();
			});
		});

		res.status(201).json(
			snakecaseKeys({
				token: session.id,
				expireAt: DateTime.fromJSDate(session.cookie.expires).toUnixInteger()
			})
		);
	} catch (error) {
		res.status(500).error(error);
	}
});

export default router;
