import BaseModel from './base-model';

const tableDefinition = {
	type: 'object',
	properties: {
		id: { type: 'string' } // hash
	},
	required: ['id'],
	additionalProperties: false
};

const otherAttributes = {
	properties: {
		name: {
			type: 'object',
			properties: {
				fullName: { type: 'string' },
				givenName: { type: 'string' },
				firstName: { type: 'string' }
			},
			required: ['fullName']
		},
		ttl: { type: 'integer', nullable: true }
	},
	required: ['name']
};

export default class User extends BaseModel {
	tableName = 'user';

	constructor(sequelize) {
		super(sequelize, tableDefinition, otherAttributes);
	}

	// 同期的な処理でのエラー検証用のメソッド
	validateSync(item) {
		// ajv default options of 'allErrors' is false
		if (!this.validateSchema(item))
			throw new Error(this.validateSchema.errors.shift().message);

		return this;
	}

	toJson(options = {}) {
		const json = super.toJson();
		if (options.exclude && Array.isArray(options.exclude))
			options.exclude.forEach((key) => delete json[key]);
		return json;
	}
}
