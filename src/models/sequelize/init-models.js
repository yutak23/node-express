import { DataTypes } from 'sequelize';
import _user from './user';

export default (sequelize) => {
	const user = _user(sequelize, DataTypes);
	return { user };
};
