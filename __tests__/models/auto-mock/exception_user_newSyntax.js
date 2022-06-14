import User from '../../../src/models/dynamodb/user';
import CustomDynamodbClient from '../../../src/lib/custom-dynamoidb-client';

jest.mock('../../../src/lib/custom-dynamoidb-client');

describe('User Model Test : newSyntax', () => {
	const models = {};

	beforeAll(() => {
		const mockCustomDynamodbClient = new CustomDynamodbClient();
		models.user = new User(mockCustomDynamodbClient);
	});

	test('Argument required', () => {
		const exec = () => {
			models.user.newSyntax();
		};
		expect(exec).toThrow();
		expect(exec).toThrowError(/^Argument required$/);
	});
});
