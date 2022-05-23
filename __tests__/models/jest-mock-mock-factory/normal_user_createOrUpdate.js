import User from '../../../src/models/user';
import CustomDynamodbClient from '../../../src/lib/custom-dynamoidb-client';

const data = {
	id: 'id',
	name: { fullName: 'fullName' },
	ttl: 1600000000
};

jest.mock('../../../src/lib/custom-dynamoidb-client', () =>
	jest.fn().mockImplementation(() => ({ putItem: () => data }))
);

// // eslint-disable-next-line arrow-body-style
// jest.mock('../../../src/lib/custom-dynamoidb-client', () => {
// 	// eslint-disable-next-line arrow-body-style
// 	return jest.fn(() => {
// 		return { putItem: () => data };
// 	});
// });

// // eslint-disable-next-line arrow-body-style
// jest.mock('../../../src/lib/custom-dynamoidb-client', () => {
// 	// eslint-disable-next-line func-names
// 	return function () {
// 		return { putItem: () => data };
// 	};
// });

describe('User Model Test : createOrUpdate', () => {
	const models = {};

	beforeAll(() => {
		// CustomDynamodbClient.mockClear(); // mock関数ではないのでエラーになるためコメントアウト

		const mockCustomDynamodbClient = new CustomDynamodbClient();
		models.user = new User(mockCustomDynamodbClient);
	});

	describe('Test Block', () => {
		test('createOrUpdate', async () => {
			const res = await models.user.createOrUpdate(data);
			expect(res.toJson()).toStrictEqual(data);
		});
	});
});
