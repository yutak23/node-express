import 'source-map-support/register';
import express, { Router } from 'express';
import appRoot from 'app-root-path';
import compression from 'compression';
import openapiValidator from './lib/custome-openapi-validator';
import errorResponse from './lib/error-response';
import CustomError from './lib/custom-error';

const app = express();
const router = Router();

app.use(compression({ level: 1, memLevel: 3 }));
app.use(express.static('static'));
app.use(express.json());
app.use(errorResponse());
app.use(openapiValidator('/api/v1/user'));
app.use('/api/v1', router);

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

router.get('/user/:userid', (req, res) => {
	res
		.status(200)
		.json({ id: 1, email: 'sample@example.com', createdAt: 111111 });
});

router.post('/user', (req, res) => {
	res.status(200).json({ id: 1, ...req.body, createdAt: 111111 });
});

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
	res.error(err);
});
app.listen(3000, () => console.log('listening on port 3000!'));
