import config from 'config';
import NumberConvertor from '../../src/lib/number-convertor';

// const numberAlphabet =
// 	'0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
// const excludedNumberAlphabet = numberAlphabet.replace(/[gwDNS]/g, '');
// const random = excludedNumberAlphabet
// 	.split('')
// 	.sort(() => 0.5 - Math.random())
// 	.join('');
// jrY1mUEbz6sC3t4f7d29WRMTquAcOB8aivhXGQyLIZV0KkxJnPpoHFle

describe('NumberConvertor class test', () => {
	describe('encrypting and decrypting', () => {
		test('for 10,000', async () => {
			const numberConvertor = new NumberConvertor({
				destinationAlphabet: config.get('numberConvertor.destinationAlphabet'),
				separetors: config.get('numberConvertor.separetors')
			});

			for (let i = 0; i < 10000; i += 1) {
				const expected =
					Math.floor(Math.random() * (10 * Math.random() * 1000)) + 1;

				const encrypted = numberConvertor.encrypting(expected);
				const decrypted = numberConvertor.decrypting(encrypted);

				expect(decrypted).toBe(expected);
			}
		});
	});
});
