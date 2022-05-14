import config from 'config';
import User from '../../../src/models/user';
import CustomDynamodbClient from '../../../src/lib/custom-dynamoidb-client';

describe('User Model Test : createOrUpdate', () => {
	const client = {};
	const models = {};
	const data = {
		id: 'id',
		name: { fullName: 'fullName' },
		ttl: 1600000000
	};

	beforeAll(() => {
		client.dynamodb = new CustomDynamodbClient(config.get('dynamodb'));
		models.user = new User(client.dynamodb);
	});

	describe('Test Block', () => {
		test('createOrUpdate', async () => {
			const res = await models.user.createOrUpdate(data);
			expect(res.toJson()).toStrictEqual(data);
		});
	});

	afterAll(async () => {
		await models.user.deleteByPk();
		client.dynamodb.destroy();
	});
});
