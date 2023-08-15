import { strict as assert } from 'assert';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
	DynamoDBDocumentClient,
	PutCommand,
	GetCommand,
	DeleteCommand
} from '@aws-sdk/lib-dynamodb';

import snakecaseKeys from 'snakecase-keys';
import camelcaseKeys from 'camelcase-keys';

export default class CustomDynamodbClient {
	constructor(options = {}) {
		this.ddbClient = new DynamoDBClient({ ...options });
		this.ddbDocClient = DynamoDBDocumentClient.from(this.ddbClient);
	}

	async putItem(item, options = {}) {
		assert.ok(options);
		assert.ok(options.tableName);

		const params = {
			TableName: options.tableName,
			Item: { ...snakecaseKeys(item) }
		};

		if ('transaction' in options) {
			const { id, transactions } = options.transaction;
			assert.ok(id);
			assert.ok(transactions && Array.isArray(transactions[id]));

			transactions[id].push({ Put: params });
			return item;
		}

		const command = new PutCommand(params);
		await this.ddbDocClient.send(command);
		return item;
	}

	async getItem(keys, options = {}) {
		assert.ok(options);
		assert.ok(options.tableName);

		const params = {
			TableName: options.tableName,
			Key: { ...snakecaseKeys(keys) }
		};

		const command = new GetCommand(params);
		const { Item } = await this.ddbDocClient.send(command);
		return camelcaseKeys(Item, { deep: true });
	}

	async deleteItem(keys, options = {}) {
		assert.ok(options);
		assert.ok(options.tableName);

		const params = {
			TableName: options.tableName,
			Key: { ...snakecaseKeys(keys) }
		};

		const command = new DeleteCommand(params);
		await this.ddbDocClient.send(command);
	}

	destroy() {
		this.ddbDocClient.destroy();
		this.ddbClient.destroy();
	}
}
