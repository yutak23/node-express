import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import { merge, mergeWith, isArray, cloneDeep } from 'lodash';

const ajv = new Ajv();
addFormats(ajv);

export default class BaseModel {
	constructor(customDynamodbClient, tableDefinition, otherAttributes) {
		this.customDynamodbClient = customDynamodbClient;

		const schema = mergeWith(cloneDeep(tableDefinition), otherAttributes, (objValue, srcValue) => {
			if (isArray(objValue)) return Array.from(new Set(objValue.concat(srcValue)));
			return merge(objValue, srcValue);
		});
		this.validateTableDefinition = ajv.compile(tableDefinition);
		this.validateSchema = ajv.compile(schema);

		this.dataValues = {};
	}

	async createOrUpdate(item, options = {}) {
		// ajv default options of 'allErrors' is false
		if (!this.validateSchema(item)) throw new Error(this.validateSchema.errors.shift().message);

		const data = await this.customDynamodbClient.putItem(item, {
			tableName: this.tableName,
			...options
		});
		this.dataValues = data;

		return this;
	}

	async findByPk(keys) {
		if (!this.validateTableDefinition(keys))
			throw new Error(this.validateTableDefinition.errors.shift().message);

		const data = await this.customDynamodbClient.getItem(keys, {
			tableName: this.tableName
		});

		if (!this.validateSchema(data)) throw new Error(this.validateSchema.errors.shift().message);
		this.dataValues = data;

		return this;
	}

	async deleteByPk() {
		const keys = {};
		Object.keys(this.validateTableDefinition.schema.properties).forEach((key) => {
			keys[key] = this.dataValues[key];
		});

		await this.customDynamodbClient.deleteItem(keys, {
			tableName: this.tableName
		});
		this.dataValues = {};

		return this;
	}

	toJson() {
		return cloneDeep(this.dataValues);
	}
}
