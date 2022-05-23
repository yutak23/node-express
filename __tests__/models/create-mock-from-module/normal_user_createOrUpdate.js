import User from '../../../src/models/user';

describe('User Model Test : createOrUpdate', () => {
	const models = {};
	const data = {
		id: 'id',
		name: { fullName: 'fullName' },
		ttl: 1600000000
	};

	beforeAll(() => {
		const mockCustomDynamodbClient = jest.createMockFromModule(
			'../../../src/lib/custom-dynamoidb-client'
		);
		mockCustomDynamodbClient.putItem = jest.fn(() => data);
		models.user = new User(mockCustomDynamodbClient);
	});

	describe('Test Block', () => {
		test('createOrUpdate', async () => {
			const res = await models.user.createOrUpdate(data);
			expect(res.toJson()).toStrictEqual(data);
		});
	});
});
