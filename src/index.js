import 'source-map-support/register';
import express, { Router } from 'express';
import appRoot from 'app-root-path';
import compression from 'compression';
import Sequelize from 'sequelize';
import config from 'config';
import chalk from 'chalk';
import openapiValidator from './lib/custome-openapi-validator';
import errorResponse from './lib/error-response';
import CustomError from './lib/custom-error';

import initModels from './models/sequelize/init-models';

import consoleExpressRouting from './lib/console-express-routing';

const app = express();
const router = Router();

app.use(compression({ level: 1, memLevel: 3 }));
app.use(express.static('static'));

app.use(express.json());
app.use(errorResponse());
app.use(openapiValidator('/api/v1/user'));

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

		res.status(201).json(user.toJSON({ exclude: [`userId`, `password`] }));
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
			users: result.rows.map((user) =>
				user.toJSON({ exclude: [`userId`, `password`] })
			)
		});
	} catch (error) {
		res.status(500).error(error);
	}
});

router.get('/user/:id', async (req, res) => {
	const { models } = req.app.locals;

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

router.patch('/user/:id', async (req, res) => {
	const { models } = req.app.locals;
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

router.get('/user/id/:userId', async (req, res) => {
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

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
	res.error(err);
});
app.listen(3000, () => {
	console.log();
	console.log('  ♻️  Server running at:');
	console.log(`    - Local:   ${chalk.cyan('http://localhost:3000')}`);
	console.log();

	// routing一覧を出力
	consoleExpressRouting({ app });
});
