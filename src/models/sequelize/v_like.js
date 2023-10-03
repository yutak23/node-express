import _sequelize from 'sequelize';
import { DateTime } from 'luxon';

const { Model, Sequelize } = _sequelize;

export default class vLike extends Model {
	static init(sequelize, DataTypes) {
		return super.init(
			{
				id: {
					type: DataTypes.INTEGER.UNSIGNED,
					allowNull: false,
					primaryKey: true
				},
				postId: {
					type: DataTypes.INTEGER.UNSIGNED,
					allowNull: false,
					field: 'post_id'
				},
				postTitle: {
					type: DataTypes.STRING(64),
					allowNull: false,
					field: 'post_title'
				},
				userId: {
					type: DataTypes.INTEGER.UNSIGNED,
					allowNull: false,
					field: 'user_id'
				},
				userEmail: {
					type: DataTypes.STRING(128),
					allowNull: false,
					field: 'user_email'
				},
				count: {
					type: DataTypes.INTEGER,
					allowNull: true,
					defaultValue: 0
				},
				createdAt: {
					type: DataTypes.DATE,
					allowNull: false,
					get() {
						return DateTime.fromJSDate(this.getDataValue('createdAt')).toUnixInteger();
					},
					field: 'created_at'
				},
				updatedAt: {
					type: DataTypes.DATE,
					allowNull: false,
					get() {
						return DateTime.fromJSDate(this.getDataValue('updatedAt')).toUnixInteger();
					},
					field: 'updated_at'
				}
			},
			{
				sequelize,
				tableName: 'v_likes',
				timestamps: false
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
