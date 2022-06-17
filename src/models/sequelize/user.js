import { Sequelize, Model } from 'sequelize';
import { DateTime } from 'luxon';
import sha256 from 'crypto-js/sha256';
import config from 'config';

const encrypt = (v) => sha256(`${v}:${config.get('salt.password')}`).toString();

export default (sequelize, DataTypes) => {
	class users extends Model {}
	users.init(
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
				type: DataTypes.CHAR(64),
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
	return users;
};
