import Sequelize from 'sequelize';
import config from 'config';
import initModels from '../src/models/sequelize/init-models';

const sequelize = new Sequelize(config.get('sequelize'));

const main = async (_sequelize) => {
	const models = initModels(_sequelize);
	await models.user.sync({ alter: true });
};

main(sequelize)
	.then(async () => {
		console.log('The table for the user model was just (re)created!');
		await sequelize.close();
	})
	.catch((err) => {
		console.error(err);
		process.exit(1);
	});
