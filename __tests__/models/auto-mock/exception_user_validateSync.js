import User from '../../../src/models/dynamodb/user';
import CustomDynamodbClient from '../../../src/lib/custom-dynamoidb-client';

jest.mock('../../../src/lib/custom-dynamoidb-client');

describe('User Model Test : validateSync', () => {
	const models = {};

	beforeAll(() => {
		const mockCustomDynamodbClient = new CustomDynamodbClient();
		models.user = new User(mockCustomDynamodbClient);
	});

	describe('Test Block', () => {
		test("must have required property 'id'", () => {
			const exec = () => {
				models.user.validateSync({});
			};
			expect(exec).toThrow();
			expect(exec).toThrow(/^must have required property 'id'$/);
		});

		test("must have required property 'name'", () => {
			const exec = () => {
				models.user.validateSync({ id: null });
			};
			expect(exec).toThrow();
			expect(exec).toThrow(/^must have required property 'name'$/);
		});

		test('id is must be string', () => {
			const exec = () => {
				models.user.validateSync({ id: null, name: null });
			};
			expect(exec).toThrow();
			expect(exec).toThrow(/^must be string$/);
		});

		test('name is must be object', () => {
			const exec = () => {
				models.user.validateSync({ id: 'id', name: null });
			};
			expect(exec).toThrow();
			expect(exec).toThrow(/^must be object$/);
		});

		test("must have required property 'fullName'", () => {
			const exec = () => {
				models.user.validateSync({ id: 'id', name: {} });
			};
			expect(exec).toThrow();
			expect(exec).toThrow(/^must have required property 'fullName'$/);
		});

		test('fullName is must be string', () => {
			const exec = () => {
				models.user.validateSync({ id: 'id', name: { fullName: null } });
			};
			expect(exec).toThrow();
			expect(exec).toThrow(/^must be string$/);
		});

		test('ttl is must be integer', () => {
			const exec = () => {
				models.user.validateSync({
					id: 'id',
					name: { fullName: 'fullName' },
					ttl: ''
				});
			};
			expect(exec).toThrow();
			expect(exec).toThrow(/^must be integer$/);
		});
	});
});
