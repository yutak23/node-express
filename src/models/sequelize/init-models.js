import _sequelize from 'sequelize';
import _comment from './comment.js';
import _like from './like.js';
import _post from './post.js';
import _user from './user.js';
import _vLike from './v_like.js';

const { DataTypes } = _sequelize;

export default function initModels(sequelize) {
	const comment = _comment.init(sequelize, DataTypes);
	const like = _like.init(sequelize, DataTypes);
	const post = _post.init(sequelize, DataTypes);
	const user = _user.init(sequelize, DataTypes);
	const vLike = _vLike.init(sequelize, DataTypes);

	comment.belongsTo(post, { as: 'post', foreignKey: 'postId' });
	post.hasMany(comment, { as: 'comments', foreignKey: 'postId' });
	like.belongsTo(post, { as: 'post', foreignKey: 'postId' });
	post.hasMany(like, { as: 'likes', foreignKey: 'postId' });
	comment.belongsTo(user, { as: 'user', foreignKey: 'userId' });
	user.hasMany(comment, { as: 'comments', foreignKey: 'userId' });
	like.belongsTo(user, { as: 'user', foreignKey: 'userId' });
	user.hasMany(like, { as: 'likes', foreignKey: 'userId' });

	return {
		comment,
		like,
		post,
		user,
		vLike
	};
}
