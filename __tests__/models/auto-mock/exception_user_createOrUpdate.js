import User from '../../../src/models/user';
// eslint-disable-next-line no-unused-vars
import CustomDynamodbClient from '../../../src/lib/custom-dynamoidb-client';

jest.mock('../../../src/lib/custom-dynamoidb-client');

describe('User Model Test : createOrUpdate', () => {
	const models = {};

	beforeAll(() => {
		models.user = new User();
	});

	describe('Test Block', () => {
		test("must have required property 'id'", async () => {
			const createOrUpdate = models.user.createOrUpdate({});

			await expect(createOrUpdate).rejects.toThrow();
			await expect(createOrUpdate).rejects.toThrowError(
				/^must have required property 'id'$/
			);
		});

		test("must have required property 'name'", async () => {
			const createOrUpdate = models.user.createOrUpdate({ id: null });

			await expect(createOrUpdate).rejects.toThrow();
			await expect(createOrUpdate).rejects.toThrowError(
				/^must have required property 'name'$/
			);
		});

		test('id is must be string', async () => {
			const createOrUpdate = models.user.createOrUpdate({
				id: null,
				name: null
			});

			await expect(createOrUpdate).rejects.toThrow();
			await expect(createOrUpdate).rejects.toThrowError(/^must be string$/);
		});

		test('name is must be object', async () => {
			const createOrUpdate = models.user.createOrUpdate({
				id: 'id',
				name: null
			});

			await expect(createOrUpdate).rejects.toThrow();
			await expect(createOrUpdate).rejects.toThrowError(/^must be object$/);
		});

		test("must have required property 'fullName'", async () => {
			const createOrUpdate = models.user.createOrUpdate({
				id: 'id',
				name: {}
			});

			await expect(createOrUpdate).rejects.toThrow();
			await expect(createOrUpdate).rejects.toThrowError(
				/^must have required property 'fullName'$/
			);
		});

		test('fullName is must be string', async () => {
			const createOrUpdate = models.user.createOrUpdate({
				id: 'id',
				name: { fullName: null }
			});

			await expect(createOrUpdate).rejects.toThrow();
			await expect(createOrUpdate).rejects.toThrowError(/^must be string$/);
		});

		test('ttl is must be integer', async () => {
			const createOrUpdate = models.user.createOrUpdate({
				id: 'id',
				name: { fullName: 'fullName' },
				ttl: ''
			});

			await expect(createOrUpdate).rejects.toThrow();
			await expect(createOrUpdate).rejects.toThrowError(/^must be integer$/);
		});
	});
});
