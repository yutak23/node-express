import 'source-map-support/register';
import express, { Router } from 'express';
import appRoot from 'app-root-path';
import compression from 'compression';
import Sequelize from 'sequelize';
import config from 'config';
// import openapiValidator from './lib/custome-openapi-validator';
import errorResponse from './lib/error-response';
import CustomError from './lib/custom-error';

import initModels from './models/sequelize/init-models';

const app = express();
const router = Router();

app.use(compression({ level: 1, memLevel: 3 }));
app.use(express.static('static'));
app.use(express.json());
app.use(errorResponse());
// app.use(openapiValidator('/api/v1/user'));

app.locals.models = initModels(new Sequelize(config.get('sequelize')));

app.use('/api/v1', router);

app.get('*', (req, res) => {
	res.sendFile(appRoot.resolve('static/index.html'));
});

router.post('/user', async (req, res) => {
	const { models } = req.app.locals;
	const { email, password } = req.body;

	try {
		const { id } = await models.user.create({ email, password });
		const user = await models.user.findByPk(id);

		res.status(201).json(user.toJSON({ exclude: ['password'] }));
	} catch (error) {
		res.status(500).error(error);
	}
});

router.get('/users', async (req, res) => {
	const { models } = req.app.locals;
	const { offset, limit } = req.query;

	try {
		const result = await models.user.findAndCountAll({
			offset: offset || 0,
			limit: limit || 10
		});

		res.status(200).json({
			total: result.count,
			users: result.rows.map((user) => user.toJSON({ exclude: ['password'] }))
		});
	} catch (error) {
		res.status(500).error(error);
	}
});

router.get('/user/:userId', async (req, res) => {
	const { models } = req.app.locals;

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

router.get('/', (req, res) => {
	try {
		console.log('debug');
		throw new CustomError(409, 'Already exits');
	} catch (error) {
		res.error(error);
	}
});

router.get('/user/:userid', (req, res) => {
	res
		.status(200)
		.json({ id: 1, email: 'sample@example.com', createdAt: 111111 });
});

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
	res.error(err);
});
app.listen(3000, () => console.log('listening on port 3000!'));
