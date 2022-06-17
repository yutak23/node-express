export default {
	// eslint-disable-next-line no-unused-vars
	async up(queryInterface, Sequelize) {
		await queryInterface.addIndex('users', ['email'], {
			name: 'idx_email',
			unique: true,
			using: 'BTREE'
		});
	},

	// eslint-disable-next-line no-unused-vars
	async down(queryInterface, Sequelize) {
		await queryInterface.removeIndex('users', 'idx_email');
	}
};
