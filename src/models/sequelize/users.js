import { Sequelize, Model } from 'sequelize';
import { DateTime } from 'luxon';
import bcrypt from 'bcrypt';

const encrypt = (v) => bcrypt.hashSync(v, 10);

export default class Users extends Model {
	static init(sequelize, DataTypes) {
		return super.init(
			{
				id: {
					allowNull: false,
					autoIncrement: true,
					primaryKey: true,
					type: DataTypes.INTEGER.UNSIGNED
				},
				email: {
					type: DataTypes.STRING(128),
					allowNull: false,
					unique: 'idx_email',
					validate: { isEmail: true }
				},
				password: {
					type: DataTypes.CHAR(60),
					allowNull: false,
					set(v) {
						this.setDataValue('password', encrypt(v));
					}
				},
				created_at: {
					allowNull: false,
					type: DataTypes.DATE,
					defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
					get() {
						return DateTime.fromJSDate(
							this.getDataValue('created_at')
						).toUnixInteger();
					}
				},
				updated_at: {
					allowNull: false,
					type: 'TIMESTAMP',
					defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
					get() {
						return DateTime.fromJSDate(
							this.getDataValue('updated_at')
						).toUnixInteger();
					}
				}
			},
			{
				sequelize,
				tableName: 'users',
				modelName: 'users',
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

	toJSON(options = {}) {
		const json = super.toJSON();
		if (options.exclude && Array.isArray(options.exclude))
			options.exclude.forEach((key) => delete json[key]);
		return json;
	}
}
