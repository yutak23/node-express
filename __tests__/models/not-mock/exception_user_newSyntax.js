import config from 'config';
import User from '../../../src/models/user';
import CustomDynamodbClient from '../../../src/lib/custom-dynamoidb-client';

describe('User Model Test : newSyntax', () => {
	const client = {};
	const models = {};

	beforeAll(() => {
		client.dynamodb = new CustomDynamodbClient(config.get('dynamodb'));
		models.user = new User(client.dynamodb);
	});

	test('Argument required', () => {
		const exec = () => {
			models.user.newSyntax();
		};
		expect(exec).toThrow();
		expect(exec).toThrowError(/^Argument required$/);
	});

	afterAll(() => {
		client.dynamodb.destroy();
	});
});
