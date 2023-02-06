const path = require('path');
const nodeExternals = require('webpack-node-externals');
const ESLintPlugin = require('eslint-webpack-plugin');

const entry = { index: './src/index.js' };
if (process.env.NODE_ENV === 'development')
	entry.migrate = './support/migrate.js';

module.exports = {
	devtool: 'source-map',
	target: 'node',
	externalsPresets: { node: true },
	externals: [nodeExternals()],
	mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
	name: 'node-express',
	entry,
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: '[name].js',
		clean: true
	},
	experiments: {
		topLevelAwait: true
	},
	module: {
		rules: [
			{
				test: /\.m?js$/,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader'
				}
			}
		]
	},
	plugins: [new ESLintPlugin({ exclude: 'node_modules' })]
};
