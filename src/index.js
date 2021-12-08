import express from 'express';

const app = express();

app.get('/', async (req, res) => {
	const reqTime = Date.now();
	console.log(Array.from('foo'));

	await new Promise((resolve) => {
		setTimeout(() => {
			resolve('sleep');
		}, 500);
	});

	res.status(200).send({
		msg: 'hello world!',
		elaptime: Date.now() - reqTime
	});
});

app.listen(3000, () => console.log('listening on port 3000!'));
