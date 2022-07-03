module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.addColumn('users', 'full_name', {
			allowNull: true,
			type: Sequelize.STRING(128)
		});
	},

	// eslint-disable-next-line no-unused-vars
	async down(queryInterface, Sequelize) {
		await queryInterface.removeColumn('users', 'full_name');
	}
};
