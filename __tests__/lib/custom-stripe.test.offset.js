import * as dotenv from 'dotenv';
import config from 'config';
import customStripe from '../../src/lib/custom-stripe';

jest.setTimeout(config.get('jest.timeout'));
dotenv.config();

describe('test for custom-stripe.js', () => {
	let stripe;
	const data = { paymentMethodIds: {}, connectPaymentMethodIds: {} };

	beforeAll(async () => {
		stripe = customStripe();

		const paymentMethodFirst = await stripe.paymentMethods.create({
			type: 'card',
			card: {
				number: '4242424242424242',
				exp_month: 6,
				exp_year: 2025,
				cvc: '123'
			}
		});
		await stripe.paymentMethods.attach(paymentMethodFirst.id, {
			customer: 'cus_NBAVbB1bzvAYyn'
		});
		data.paymentMethodIds.first = paymentMethodFirst.id;

		const paymentMethodSecond = await stripe.paymentMethods.create({
			type: 'card',
			card: {
				number: '4242424242424242',
				exp_month: 12,
				exp_year: 2030,
				cvc: '123'
			}
		});
		await stripe.paymentMethods.attach(paymentMethodSecond.id, {
			customer: 'cus_NBAVbB1bzvAYyn'
		});
		data.paymentMethodIds.second = paymentMethodSecond.id;

		const connectPaymentMethodFirst = await stripe.paymentMethods.create(
			{
				type: 'card',
				card: {
					number: '4242424242424242',
					exp_month: 6,
					exp_year: 2025,
					cvc: '123'
				}
			},
			{ stripeAccount: 'acct_1MSJ014IT6MHHPbU' }
		);
		await stripe.paymentMethods.attach(
			connectPaymentMethodFirst.id,
			{ customer: 'cus_NCiXY6X4rpmuHd' },
			{ stripeAccount: 'acct_1MSJ014IT6MHHPbU' }
		);
		data.connectPaymentMethodIds.first = connectPaymentMethodFirst.id;

		const connectPaymentMethodSecond = await stripe.paymentMethods.create(
			{
				type: 'card',
				card: {
					number: '4242424242424242',
					exp_month: 12,
					exp_year: 2030,
					cvc: '123'
				}
			},
			{ stripeAccount: 'acct_1MSJ014IT6MHHPbU' }
		);
		await stripe.paymentMethods.attach(
			connectPaymentMethodSecond.id,
			{ customer: 'cus_NCiXY6X4rpmuHd' },
			{ stripeAccount: 'acct_1MSJ014IT6MHHPbU' }
		);
		data.connectPaymentMethodIds.second = connectPaymentMethodSecond.id;
	});

	describe('stripe.customers.$list', () => {
		test('no options', async () => {
			const customers = await stripe.customers.$list();

			expect(customers).toHaveProperty('[0].id', 'cus_NBAVbB1bzvAYyn');
			expect(customers).toHaveProperty('[1].id', 'cus_NBAVMqwfEm6xiH');
			expect(customers).toHaveProperty('[9].id', 'cus_NBAVjUtVvm0MGC');
			expect(customers).toHaveLength(10);
		});

		test('offset 1', async () => {
			const customers = await stripe.customers.$list({ offset: 1 });

			expect(customers).toHaveProperty('[0].id', 'cus_NBAVMqwfEm6xiH');
			expect(customers).toHaveProperty('[8].id', 'cus_NBAVjUtVvm0MGC');
			expect(customers).toHaveProperty('[9].id', 'cus_NBAVSBfOrXU4Wd');
			expect(customers).toHaveLength(10);
		});

		test('offset 9 and limit 1', async () => {
			const customers = await stripe.customers.$list({ offset: 9, limit: 1 });

			expect(customers).toHaveProperty('[0].id', 'cus_NBAVjUtVvm0MGC');
			expect(customers).toHaveLength(1);
		});

		test('stripeAccount', async () => {
			const customers = await stripe.customers.$list({
				stripeAccount: 'acct_1MSJ014IT6MHHPbU'
			});

			expect(customers).toHaveProperty('[0].id', 'cus_NCiYWBJJoKfDRS');
			expect(customers).toHaveLength(5);
		});

		test('stripeAccount with limit 1', async () => {
			const customers = await stripe.customers.$list(
				{ limit: 1 },
				{ stripeAccount: 'acct_1MSJ014IT6MHHPbU' }
			);

			expect(customers).toHaveProperty('[0].id', 'cus_NCiYWBJJoKfDRS');
			expect(customers).toHaveLength(1);
		});

		test('stripeAccount with limit 1 and offset 1', async () => {
			const customers = await stripe.customers.$list(
				{ limit: 1, offset: 1 },
				{ stripeAccount: 'acct_1MSJ014IT6MHHPbU' }
			);

			expect(customers).toHaveProperty('[0].id', 'cus_NCiY8hyIlRDYuS');
			expect(customers).toHaveLength(1);
		});
	});

	describe('stripe.customers.$listPaymentMethods', () => {
		test('no options', async () => {
			const paymentMethods = await stripe.customers.$listPaymentMethods(
				'cus_NBAVbB1bzvAYyn'
			);

			expect(paymentMethods).toHaveProperty(
				'[0].id',
				data.paymentMethodIds.second
			);
			expect(paymentMethods).toHaveProperty(
				'[1].id',
				data.paymentMethodIds.first
			);
			expect(paymentMethods).toHaveLength(2);
		});

		test('limit 1', async () => {
			const paymentMethods = await stripe.customers.$listPaymentMethods(
				'cus_NBAVbB1bzvAYyn',
				{ limit: 1 }
			);

			expect(paymentMethods).toHaveLength(1);
		});

		test('limit 1 and offset 1', async () => {
			const paymentMethods = await stripe.customers.$listPaymentMethods(
				'cus_NBAVbB1bzvAYyn',
				{ limit: 1, offset: 1 }
			);

			expect(paymentMethods).toHaveProperty(
				'[0].id',
				data.paymentMethodIds.first
			);
			expect(paymentMethods).toHaveLength(1);
		});

		test('stripeAccount', async () => {
			const paymentMethods = await stripe.customers.$listPaymentMethods(
				'cus_NCiXY6X4rpmuHd',
				{ stripeAccount: 'acct_1MSJ014IT6MHHPbU' }
			);

			expect(paymentMethods).toHaveProperty(
				'[0].id',
				data.connectPaymentMethodIds.second
			);
			expect(paymentMethods).toHaveProperty(
				'[1].id',
				data.connectPaymentMethodIds.first
			);
			expect(paymentMethods).toHaveLength(2);
		});

		test('stripeAccount with limit 1', async () => {
			const paymentMethods = await stripe.customers.$listPaymentMethods(
				'cus_NCiXY6X4rpmuHd',
				{ limit: 1 },
				{ stripeAccount: 'acct_1MSJ014IT6MHHPbU' }
			);

			expect(paymentMethods).toHaveLength(1);
		});

		test('stripeAccount with limit 1 and offset 1', async () => {
			const paymentMethods = await stripe.customers.$listPaymentMethods(
				'cus_NCiXY6X4rpmuHd',
				{ limit: 1, offset: 1 },
				{ stripeAccount: 'acct_1MSJ014IT6MHHPbU' }
			);

			expect(paymentMethods).toHaveProperty(
				'[0].id',
				data.connectPaymentMethodIds.first
			);
			expect(paymentMethods).toHaveLength(1);
		});
	});

	afterAll(async () => {
		await Promise.all(
			Object.keys(data.paymentMethodIds).map((key) =>
				stripe.paymentMethods.detach(data.paymentMethodIds[key])
			)
		);

		await Promise.all(
			Object.keys(data.connectPaymentMethodIds).map((key) =>
				stripe.paymentMethods.detach(data.connectPaymentMethodIds[key], {
					stripeAccount: 'acct_1MSJ014IT6MHHPbU'
				})
			)
		);
	});
});
