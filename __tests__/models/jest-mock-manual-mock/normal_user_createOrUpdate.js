import User from '../../../src/models/user';
// eslint-disable-next-line no-unused-vars
import CustomDynamodbClient from '../../../src/lib/custom-dynamoidb-client';

jest.mock('../../../src/lib/custom-dynamoidb-client');

describe('User Model Test : createOrUpdate', () => {
	const models = {};
	const data = {
		id: 'id',
		name: { fullName: 'fullName' },
		ttl: 1600000000
	};

	beforeAll(() => {
		models.user = new User();
	});

	describe('Test Block', () => {
		test('createOrUpdate', async () => {
			const res = await models.user.createOrUpdate(data);
			expect(res.toJson()).toStrictEqual(data);
		});
	});
});
