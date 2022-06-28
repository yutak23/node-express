import NumberCryptoDecrypto from '../../src/lib/number-crypto-decrypto';

describe('NumberCryptoDecrypto class test', () => {
	describe('new', () => {
		test('no options', async () => {
			const numberCryptoDecrypto = new NumberCryptoDecrypto();
			expect(numberCryptoDecrypto).not.toBe(null);
		});

		test('options', async () => {
			const seed = 'abcdefg';
			const separetors = '12';
			const password = 'password';
			const salt = 'salt';

			const numberCryptoDecrypto = new NumberCryptoDecrypto({
				seed,
				separetors,
				password,
				salt
			});

			expect(numberCryptoDecrypto).toHaveProperty('seed', seed);
			expect(numberCryptoDecrypto).toHaveProperty(
				'separetors',
				separetors.split('')
			);
			expect(numberCryptoDecrypto.separetors).toEqual(
				expect.arrayContaining(separetors.split(''))
			);
			expect(numberCryptoDecrypto.key.toString('hex')).toBe(
				'745731af4484f323968969eda289aeee'
			);
		});

		test('seed contains separators string', async () => {
			expect(() => {
				// eslint-disable-next-line no-new
				new NumberCryptoDecrypto({
					seed: '123456789',
					separetors: '2'
				});
			}).toThrowError(`separetors string is not include in seed.`);
		});

		test('seed contains separators string with multiple', async () => {
			expect(() => {
				// eslint-disable-next-line no-new
				new NumberCryptoDecrypto({
					seed: '123456789',
					separetors: '25'
				});
			}).toThrowError(`separetors string is not include in seed.`);
		});
	});

	describe('encrypting and decrypting', () => {
		test('for 10,000', async () => {
			const numberCryptoDecrypto = new NumberCryptoDecrypto();

			for (let i = 0; i < 10000; i += 1) {
				const expected = Math.floor(Math.random() * (100 + 1 - 1)) + 1;

				const encrypted = numberCryptoDecrypto.encrypting(expected);
				const decrypted = numberCryptoDecrypto.decrypting(encrypted);

				expect(decrypted).toBe(expected.toString());
			}
		});
	});
});
