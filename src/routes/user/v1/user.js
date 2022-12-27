import { Router } from 'express';

const router = Router();

router.post('/', async (req, res) => {
	const { models } = req.app.locals;
	const { email, password } = req.body;

	try {
		const { id } = await models.user.create({ email, password });
		const user = await models.user.findByPk(id);

		res.status(201).json(user.toJSON({ exclude: [`userId`, `password`] }));
	} catch (error) {
		res.status(500).error(error);
	}
});

router.get('/:id', async (req, res) => {
	const { models, CustomError } = req.app.locals;

	try {
		const user = await models.user.findByPk(req.params.id, {
			attributes: { exclude: [`password`] }
		});
		if (!user) throw new CustomError(404, 'Not Found');

		res.status(200).json(user.toJSON({ exclude: [`userId`] }));
	} catch (error) {
		res.status(500).error(error);
	}
});

router.patch('/:id', async (req, res) => {
	const { models, CustomError } = req.app.locals;
	const data = req.body;

	try {
		const user = await models.user.findByPk(req.params.id, {
			attributes: { exclude: [`password`] }
		});
		if (!user) throw new CustomError(404, 'Not Found');

		Object.keys(data).forEach((key) => {
			user[key] = data[key];
		});
		await user.save();

		res.status(200).json(user.toJSON({ exclude: [`userId`] }));
	} catch (error) {
		res.status(500).error(error);
	}
});

router.get('/id/:userId', async (req, res) => {
	const { models, CustomError } = req.app.locals;

	try {
		const user = await models.user.findByUserId(req.params.userId, {
			attributes: { exclude: [`password`] }
		});
		if (!user) throw new CustomError(404, 'Not Found');

		res.status(200).json(user.toJSON());
	} catch (error) {
		res.status(500).error(error);
	}
});

export default router;
