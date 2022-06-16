/**
 * targets: { node: 'current' } <- https://babeljs.io/docs/en/options#targetsnode
 * current = process.versions.node である
 *
 * ※nodeに変換するのであれば、`useBuiltIns`・`corejs`の設定は不要かもしれない（nodeではasync/awaitも標準組み込みオブジェクトも対応しているので）
 *   ES5に変換したい時は必要なので一応残しておく
 */
module.exports = {
	presets: [
		[
			'@babel/preset-env',
			{
				// useBuiltIns: 'usage',
				// corejs: 3,
				targets: { node: 'current' }
			}
		]
	],
	plugins: ['@babel/plugin-proposal-throw-expressions']
};
