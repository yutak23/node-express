import crypto from 'crypto';
import { strict as assert } from 'assert';
import anyBase from 'any-base';
import config from 'config';
import { uniq } from 'lodash';

const sha256hash = (buffer, salt) =>
	crypto.createHash('sha256').update(`${salt}:${buffer}`).digest('hex');

export default class NumberConvertor {
	checksumLength = 10;

	salt = config.get('numberConvertor.salt') || 'salt';

	constructor(options = {}) {
		this.destinationAlphabet = options.destinationAlphabet || anyBase.HEX;
		this.separetors = (
			options.separetors || config.get('numberConvertor.separetors')
		).split('');

		if (
			uniq(this.destinationAlphabet.split('')).length !==
			this.destinationAlphabet.length
		)
			throw new Error(`destinationAlphabet must not be duplicate`);

		this.encode = anyBase(anyBase.DEC, this.destinationAlphabet);
		this.decode = anyBase(this.destinationAlphabet, anyBase.DEC);

		this.getChecksum = (encoded) =>
			sha256hash(encoded, this.salt).substring(0, this.checksumLength);
		// .replace(new RegExp(`[${this.separetors.join('')}]`, 'g'), ''); separetorsの文字列を削除
	}

	encrypting(number) {
		assert.ok(typeof number === 'number', 'must be number');

		const encoded = this.encode(number.toString());
		const checksum = this.getChecksum(encoded);
		const separetor = this.separetors[number % this.separetors.length];

		return `${encoded}${separetor}${checksum}`;
	}

	decrypting(id) {
		assert.ok(typeof id === 'string', 'must be string');

		const values = id.split(new RegExp(`[${this.separetors.join('')}]`), 2);
		const decoded = parseInt(this.decode(values[0]), 10);
		const checksum = this.getChecksum(values[0]);

		if (values[1] !== checksum) return null;
		return decoded;
	}
}
