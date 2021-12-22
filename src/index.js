import 'source-map-support/register';
import express from 'express';

const app = express();
app.use(express.json());

// eslint-disable-next-line no-unused-vars
app.get('/', (req, res) => {
	throw new Error('test');
});

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
	console.log(err);
	res.status(500).send();
});
app.listen(3000, () => console.log('listening on port 3000!'));
