import { DataTypes } from 'sequelize';
import Users from './users';

export default (sequelize) => {
	const user = Users.init(sequelize, DataTypes);
	return { user };
};
