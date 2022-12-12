import config from 'config';
import KeyGenerator from '../../src/lib/key-generator';

// const numberAlphabet =
// 	'0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
// const excludedNumberAlphabet = numberAlphabet.replace(/[gwDNS]/g, '');
// const random = excludedNumberAlphabet
// 	.split('')
// 	.sort(() => 0.5 - Math.random())
// 	.join('');
// jrY1mUEbz6sC3t4f7d29WRMTquAcOB8aivhXGQyLIZV0KkxJnPpoHFle

describe('NumberConvertor class test', () => {
	describe('new', () => {
		test('destinationAlphabet contains duplicate alphabet', async () => {
			expect(() => {
				// eslint-disable-next-line no-new
				new KeyGenerator({ destinationAlphabet: 'aa', separetors: 'x' });
			}).toThrow(`destinationAlphabet must not be duplicate`);
		});
	});

	describe('encrypting and decrypting', () => {
		test('for 10,000', async () => {
			const keyGenerator = new KeyGenerator({
				destinationAlphabet: config.get('keyGenerator.destinationAlphabet'),
				separetors: config.get('keyGenerator.separetors')
			});

			for (let i = 0; i < 10000; i += 1) {
				const options = { hoge: i % 2 === 0, foo: i % 3 === 0 };

				const key = keyGenerator.create(options);
				expect(keyGenerator.verify(key)).toEqual(options);
			}
		});
	});
});
