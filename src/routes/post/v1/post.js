import { Router } from 'express';
import verifyAccess from '../../../lib/verify-access';

const router = Router();

router.post('/', verifyAccess(), async (req, res) => {
	const { models } = req.app.locals;

	try {
		const { id } = await models.post.create(req.body);
		const post = await models.post.findByPk(id);

		res.status(200).json(post.toJSON());
	} catch (error) {
		res.status(500).error(error);
	}
});

router.post('/:postId/comment', verifyAccess(), async (req, res) => {
	const { sequelize, models, CustomError } = req.app.locals;
	const { postId } = req.params;

	const transaction = await sequelize.transaction();
	try {
		const post = await models.post.findOne({
			where: { id: postId, enabled: 1 },
			lock: true,
			transaction
		});
		if (!post) throw new CustomError(404, 'data not Found');

		const { id } = await models.comment.create(
			{ ...req.body, postId, userId: req.tokens.userId },
			{ transaction }
		);

		const commentCount = await models.comment.count({ where: { postId }, transaction });
		post.commentCount = commentCount;
		await post.save({ transaction });

		const comment = await models.comment.findByPk(id, { transaction });

		await transaction.commit();

		res.status(200).json(comment.toJSON());
	} catch (error) {
		console.log(error);
		await transaction.rollback();
		res.status(500).error(error);
	}
});

export default router;
