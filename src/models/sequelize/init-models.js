import _sequelize from 'sequelize';
import _like from './like.js';
import _post from './post.js';
import _user from './user.js';
import _vLike from './v_like.js';

const { DataTypes } = _sequelize;

export default function initModels(sequelize) {
	const like = _like.init(sequelize, DataTypes);
	const post = _post.init(sequelize, DataTypes);
	const user = _user.init(sequelize, DataTypes);
	const vLike = _vLike.init(sequelize, DataTypes);

	like.belongsTo(post, { as: 'post', foreignKey: 'postId' });
	post.hasMany(like, { as: 'likes', foreignKey: 'postId' });
	like.belongsTo(user, { as: 'user', foreignKey: 'userId' });
	user.hasMany(like, { as: 'likes', foreignKey: 'userId' });

	return {
		like,
		post,
		user,
		vLike
	};
}
