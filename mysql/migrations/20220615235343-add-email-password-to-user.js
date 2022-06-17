export default {
	async up(queryInterface, Sequelize) {
		await queryInterface.addColumn('users', 'email', {
			allowNull: false,
			type: Sequelize.STRING(128)
		});
		await queryInterface.addColumn('users', 'password', {
			allowNull: false,
			type: Sequelize.CHAR(64)
		});
	},

	// eslint-disable-next-line no-unused-vars
	async down(queryInterface, Sequelize) {
		await queryInterface.removeColumn('users', 'email');
		await queryInterface.removeColumn('users', 'password');
	}
};
