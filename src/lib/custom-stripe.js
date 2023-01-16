import Stripe from 'stripe';
import { strict as assert } from 'assert';
import snakecaseKeys from 'snakecase-keys';
import camelcaseKeys from 'camelcase-keys';

export default () => {
	assert.ok(
		process.env.STRIPE_KEY_SECRET,
		'env STRIPE_KEY_SECRET must be required'
	);
	const stripe = Stripe(process.env.STRIPE_KEY_SECRET);

	// IF（入出力）をcamelCaseにした関数を別途定義（_〇〇 のように利用）
	Object.keys(stripe)
		.filter(
			(category) => !category.startsWith('_') && !category.match(/^[A-Z].+/)
		)
		.forEach((category) => {
			Object.keys(Object.getPrototypeOf(stripe[category]))
				.filter((func) => typeof stripe[category][func] === 'function')
				.forEach((func) => {
					stripe[category][`$${func}`] = async (...args) => {
						const snakecaseArgs = snakecaseKeys(args, { deep: true });
						const result = await stripe[category][func](...snakecaseArgs);
						return camelcaseKeys(result, { deep: true });
					};
				});
		});

	return stripe;
};
