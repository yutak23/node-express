import * as dotenv from 'dotenv';
import customStripe from '../src/lib/custom-stripe';

dotenv.config();

describe('test for custom-stripe.js', () => {
	let stripe;

	beforeAll(() => {
		stripe = customStripe();
	});

	describe('stripe.customers.$retrieve', () => {
		test('retrieve', async () => {
			const customerId = 'cus_MzVc08uHaCvDqX';
			const customer = await stripe.customers.$retrieve(customerId);

			expect(customer).toHaveProperty('id', customerId);
			expect(customer).toHaveProperty('email', null);
			expect(customer).toHaveProperty('invoicePrefix', 'FF097A4B');
		});
	});

	describe('stripe.customers.$create', () => {
		const data = {};
		test('create', async () => {
			const customer = await stripe.customers.$create({
				description: 'test customer',
				metadata: { hogeHoge: 'hogehoge' }
			});

			expect(customer).toHaveProperty('id', expect.any(String));
			expect(customer).toHaveProperty('description', 'test customer');
			expect(customer).toHaveProperty('metadata.hogeHoge', 'hogehoge');

			data.customerId = customer.id;
		});

		test('metadata is snake_case key', async () => {
			const customer = await stripe.customers.retrieve(data.customerId);

			expect(customer).toHaveProperty('metadata.hoge_hoge', 'hogehoge');
		});

		test('delete', async () => {
			const customer = await stripe.customers.$del(data.customerId);

			expect(customer).toHaveProperty('deleted', true);
		});
	});
});
