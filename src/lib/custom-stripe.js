import { strict as assert } from 'assert';
import Stripe from 'stripe';
import snakecaseKeys from 'snakecase-keys';
import camelcaseKeys from 'camelcase-keys';
import config from 'config';

const execute = async (options = {}) => {
	assert.ok(options.stripe, 'stripe must be required');
	assert.ok(options.category, 'category must be required');
	assert.ok(options.func, 'func must be required');
	assert.ok(options.args, 'args must be required');

	const { stripe, category, func, args } = options;

	const snakecaseArgs = snakecaseKeys(args, {
		deep: true,
		exclude: ['stripeAccount']
	});
	const result = await stripe[category][func](...snakecaseArgs);
	return camelcaseKeys(result, { deep: true });
};

export default () => {
	assert.ok(process.env.STRIPE_KEY_SECRET, 'env STRIPE_KEY_SECRET must be required');
	const stripe = Stripe(process.env.STRIPE_KEY_SECRET);

	// IF（入出力）をcamelCaseにした関数を別途定義（_〇〇 のように利用）
	Object.keys(stripe)
		.filter((category) => !category.startsWith('_') && !category.match(/^[A-Z].+/))
		.forEach((category) => {
			Object.keys(Object.getPrototypeOf(stripe[category]))
				.filter((func) => typeof stripe[category][func] === 'function')
				.forEach((func) => {
					stripe[category][`$${func}`] = async (...origin) => {
						const args = origin;
						if (!func.startsWith('list')) {
							const v = await execute({ stripe, category, func, args });
							return v;
						}

						let limit = config.get('stripe.limit');
						let offset = 0;

						// 想定 [ 'hoge' ]
						if (typeof args[0] === 'string') {
							const option = args[1];

							// 想定 [ 'hoge', {} ]
							if (option) {
								// 想定 [ 'hoge', { stripeAccount: 'connectAccountId' } ]
								if ('stripeAccount' in option) {
									args.splice(1, 0, { limit }); // [ 'hoge', { limit: 10 }, { stripeAccount: 'connectAccountId' } ]
								}

								// 想定 [ 'hoge', { } ] or [ 'hoge', { limit: 1 } ]
								else {
									limit = option.limit || limit;
									option.limit = limit; // [ 'hoge', { limit: 10 } ]

									offset = option.offset || offset;
									delete option.offset;
								}
							}

							// 想定 [ 'hoge' ]
							else args.push({ limit }); // [ 'hoge', { limit: 10 } ]
						}

						// 想定 [ {} ]
						if (typeof args[0] === 'object') {
							const option = args[0];

							// 想定 [ { stripeAccount: 'connectAccountId' } ]
							if ('stripeAccount' in option) {
								args.unshift({ limit }); // [ { limit: 10 }, { stripeAccount: 'connectAccountId' } ]
							}

							// 想定 [ {} ] or [ { limit: 1, offset: 1} ]
							else {
								limit = option.limit || limit;
								option.limit = limit; // [ { limit: 10 } ]

								offset = option.offset || offset;
								delete option.offset;
							}
						}

						// 想定 [ ]
						if (!args[0]) args.push({ limit });

						const datas = [];
						for (;;) {
							// eslint-disable-next-line no-await-in-loop
							const { object, data, hasMore } = await execute({
								stripe,
								category,
								func,
								args
							});
							if (object !== 'list') throw new Error('expected list object');
							data.forEach((v) => {
								datas.push(v);
							});

							if (!data.length || !hasMore || datas.length >= offset + limit) break;

							// [ {} ] -> args[0], [ 'hoge' ] -> args[1]
							const index = typeof args[0] === 'object' ? 0 : 1;
							args[index].startingAfter = data[data.length - 1].id;
						}

						return datas.slice(offset).slice(0, limit);
					};
				});
		});

	return stripe;
};
