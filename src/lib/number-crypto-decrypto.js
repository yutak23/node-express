import crypto from 'crypto';
import config from 'config';
import anyBase from 'any-base';
import pad from 'pad-left';

export default class NumberCryptoDecrypto {
	algorithm = 'aes-128-cbc';

	inputEncoding = 'utf8';

	outputEncoding = 'hex';

	constructor(options = {}) {
		if (
			'seed' in options &&
			'separetors' in options &&
			options.seed.match(new RegExp(`[${options.separetors}]`))
		)
			throw new Error('separetors string is not include in seed.');

		this.seed = options.seed || config.get('crypto.seed');

		this.key = crypto.scryptSync(
			options.password || config.get('crypto.password'),
			options.salt || config.get('crypto.salt'),
			16
		);

		this.separetors = (options.separetors || config.get('crypto.separetors')).split('');

		this.hexToShort = anyBase(anyBase.HEX, this.seed);
		this.shortToHex = anyBase(this.seed, anyBase.HEX);
	}

	encrypting(number) {
		if (typeof number !== 'number') throw new Error(`arg must be number value.`);

		const iv = crypto.randomBytes(16);
		const cipher = crypto.createCipheriv(this.algorithm, this.key, iv);

		let encrypted = cipher.update(number.toString(), this.inputEncoding, this.outputEncoding);
		encrypted += cipher.final('hex');

		const separetor = this.separetors[number % this.separetors.length];
		const ivHex = iv.toString('hex');

		return `${this.hexToShort(encrypted)}${separetor}${this.hexToShort(ivHex)}`;
	}

	decrypting(encryptedAndIv) {
		try {
			const values = encryptedAndIv.split(new RegExp(`[${this.separetors.join('')}]`));

			// 元の数値が16進数16Bytes（32桁）
			const numberHex = pad(this.shortToHex(values[0]), 32, '0');
			const ivHex = pad(this.shortToHex(values[1]), 32, '0');

			const decipher = crypto.createDecipheriv(this.algorithm, this.key, Buffer.from(ivHex, 'hex'));

			let decrypted = decipher.update(numberHex, this.outputEncoding, this.inputEncoding);
			decrypted += decipher.final(this.inputEncoding);

			return decrypted;
		} catch (e) {
			return null;
		}
	}
}
