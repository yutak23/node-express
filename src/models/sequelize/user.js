import { strict as assert } from 'assert';
import _sequelize from 'sequelize';
import { DateTime } from 'luxon';
import config from 'config';
import sha256 from 'crypto-js/sha256';

const encrypt = (v) => sha256(`${v}:${config.get('crypto.salt')}`).toString();
const { Model, Sequelize } = _sequelize;

export default class user extends Model {
	static init(sequelize, DataTypes) {
		return super.init(
			{
				id: {
					autoIncrement: true,
					type: DataTypes.INTEGER.UNSIGNED,
					allowNull: false,
					primaryKey: true
				},
				email: {
					type: DataTypes.STRING(128),
					allowNull: false,
					unique: 'idx_email'
				},
				password: {
					type: DataTypes.CHAR(60),
					allowNull: false,
					set(v) {
						this.setDataValue('password', encrypt(v));
					}
				},
				firstName: {
					type: DataTypes.STRING(128),
					allowNull: true,
					field: 'first_name'
				},
				lastName: {
					type: DataTypes.STRING(128),
					allowNull: true,
					field: 'last_name'
				},
				createdAt: {
					type: DataTypes.DATE,
					allowNull: false,
					defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP'),
					get() {
						return DateTime.fromJSDate(this.getDataValue('createdAt')).toUnixInteger();
					},
					set(v) {
						this.setDataValue(
							'createdAt',
							v ? DateTime.fromSeconds(v).toFormat('yyyy-LL-dd HH:mm:ss') : null
						);
					},
					field: 'created_at'
				},
				updatedAt: {
					type: DataTypes.DATE,
					allowNull: false,
					defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP'),
					get() {
						return DateTime.fromJSDate(this.getDataValue('updatedAt')).toUnixInteger();
					},
					set(v) {
						this.setDataValue(
							'updatedAt',
							v ? DateTime.fromSeconds(v).toFormat('yyyy-LL-dd HH:mm:ss') : null
						);
					},
					field: 'updated_at'
				},
				fullName: {
					type: DataTypes.VIRTUAL,
					get() {
						return `${this.getDataValue('firstName')} ${this.getDataValue('lastName')}`;
					},
					field: 'full_name'
				}
			},
			{
				sequelize,
				tableName: 'users',
				timestamps: false,
				indexes: [
					{
						name: 'PRIMARY',
						unique: true,
						using: 'BTREE',
						fields: [{ name: 'id' }]
					},
					{
						name: 'idx_email',
						unique: true,
						using: 'BTREE',
						fields: [{ name: 'email' }]
					}
				]
			}
		);
	}

	static findByEmailPassword(email, password) {
		assert.ok(email, 'email is required');
		assert.ok(password, 'password is required');

		return this.findOne({
			where: {
				email,
				password: encrypt(password)
			},
			attributes: {
				exclude: ['password']
			}
		});
	}

	toJSON(options = {}) {
		const json = super.toJSON();
		if (options.exclude && Array.isArray(options.exclude))
			options.exclude.forEach((key) => delete json[key]);
		return json;
	}
}
