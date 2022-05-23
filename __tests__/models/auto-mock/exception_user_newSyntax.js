import User from '../../../src/models/user';
// eslint-disable-next-line no-unused-vars
import CustomDynamodbClient from '../../../src/lib/custom-dynamoidb-client';

jest.mock('../../../src/lib/custom-dynamoidb-client');

describe('User Model Test : newSyntax', () => {
	const models = {};

	beforeAll(() => {
		models.user = new User();
	});

	test('Argument required', () => {
		const exec = () => {
			models.user.newSyntax();
		};
		expect(exec).toThrow();
		expect(exec).toThrowError(/^Argument required$/);
	});
});
