import anyBase from 'any-base';
import config from 'config';
import { uniq } from 'lodash';
import crypto from 'crypto';
import { customAlphabet } from 'nanoid';
import { strict as assert } from 'assert';

const sha256hash = (buffer, salt) =>
	crypto.createHash('sha256').update(`${salt}:${buffer}`).digest('hex');

export default class KeyGenerator {
	lengthOfOneKey = 5;

	salt = config.get('keyGenerator.salt') || 'salt';

	optionKeys = config.get('keyGenerator.keys');

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

		this.nanoid = customAlphabet(
			this.destinationAlphabet.split('').sort().join('')
		);
		this.encode = anyBase(anyBase.DEC, this.destinationAlphabet);
		this.decode = anyBase(this.destinationAlphabet, anyBase.DEC);

		this.getChecksum = (encoded, checksumLength) =>
			sha256hash(encoded, this.salt).substring(0, checksumLength);
	}

	create(options = { hoge: false, foo: false }) {
		const randomKey = this.nanoid(this.lengthOfOneKey * 3);
		const encodedReversible = this.encode(
			this.#flagToNumber(options).toString()
		);
		const checksum = this.getChecksum(encodedReversible, 4);

		return `${randomKey}${encodedReversible}${checksum}`
			.match(new RegExp(`.{${this.lengthOfOneKey}}`, 'g'))
			.join('-');
	}

	verify(key) {
		assert.ok(key && key.split('-').length === 4, 'invalid key');

		const splitedKey = key.split('-');
		const reversibleAndChecksum = splitedKey[splitedKey.length - 1];
		const reversible = reversibleAndChecksum.substring(0, 1);
		const checksum = reversibleAndChecksum.substring(1, 5);

		if (this.getChecksum(reversible, 4) !== checksum) return null;
		return this.#numberToFlag(reversible);
	}

	#flagToNumber(options = {}) {
		assert.ok(Object.keys(options).length);

		const bitArray = [];
		Object.keys(options).forEach((key, index) => {
			if (key !== this.optionKeys[index])
				throw new Error(`must mutch key order`);

			if (options[key]) return bitArray.push(1);
			return bitArray.push(0);
		});
		const number = parseInt(bitArray.join('').toString(), 2);

		if (number > this.destinationAlphabet.length)
			throw new Error(
				`must be less than destinationAlphabet.lenght because number base`
			);
		return number;
	}

	#numberToFlag(id) {
		const number = parseInt(this.decode(id), 10);
		const booleanArray = number
			.toString(2)
			.split('')
			.map((x) => x === '1');

		while (booleanArray.length < this.optionKeys.length) {
			booleanArray.unshift(false);
		}

		const options = {};
		booleanArray.forEach((flag, index) => {
			options[this.optionKeys[index]] = flag;
		});

		return options;
	}
}
