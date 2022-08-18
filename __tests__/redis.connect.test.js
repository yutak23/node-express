import Redis from 'ioredis';

const config = {
	port: 6379,
	host: '127.0.0.1'
};
const sleep = (ms) =>
	new Promise((res) => {
		setTimeout(res, ms);
	});

// eslint-disable-next-line jest/no-disabled-tests
describe.skip('connect for DB', () => {
	// eslint-disable-next-line jest/expect-expect
	test('new Redis only', async () => {
		await sleep(2000);

		// eslint-disable-next-line no-new
		new Redis(config);

		await sleep(2000);

		// eslint-disable-next-line no-new
		new Redis(config);

		await sleep(2000);

		// eslint-disable-next-line no-new
		new Redis(config);

		await sleep(2000);
	});
});
