import 'source-map-support/register';
import express, { Router } from 'express';
import appRoot from 'app-root-path';
import compression from 'compression';
import Sequelize from 'sequelize';
import config from 'config';
import chalk from 'chalk';

import errorResponse from './lib/error-response';
import CustomError from './lib/custom-error';

import initModels from './models/sequelize/init-models';
import createRoutes from './routes';

import consoleExpressRouting from './lib/console-express-routing';

const app = express();
const router = Router();

app.use(compression({ level: 1, memLevel: 3 }));
app.use(express.static('static'));

app.use(express.json());
app.use(errorResponse());

app.locals.models = initModels(new Sequelize(config.get('sequelize')));
app.locals.CustomError = CustomError;

const routes = await createRoutes();
await Promise.all(Object.keys(routes).map((route) => routes[route]({ app })));

app.use('/api/409/error', router);

app.get('*', (req, res) => {
	res.sendFile(appRoot.resolve('static/index.html'));
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
