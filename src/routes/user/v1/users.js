import { Router } from 'express';

const router = Router();

router.get('/', async (req, res) => {
	const { models } = req.app.locals;
	const { offset, limit } = req.query;

	try {
		const result = await models.user.findAndCountAll({
			offset: offset || 0,
			limit: limit || 10
		});

		res.status(200).json({
			total: result.count,
			users: result.rows.map((user) =>
				user.toJSON({ exclude: [`userId`, `password`] })
			)
		});
	} catch (error) {
		res.status(500).error(error);
	}
});

export default router;
