import { DataTypes } from 'sequelize';
import User from './user';

export default (sequelize) => {
	const user = User.init(sequelize, DataTypes);
	return { user };
};
