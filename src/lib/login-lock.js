import config from 'config';
import Redis from 'ioredis';

export default class LoginLock {
	constructor(options = {}) {
		// FIXME if options.redis is undefined, throw new error

		this.redis = new Redis(options.redis);
		this.key = options.accountId;
		this.failLimitCount = options.failLimitCount || 5;
		this.expire = options.expire || config.get('expires.default');
	}

	async incrFailCount() {
		await this.redis
			.pipeline()
			.incr(this.key)
			.expire(this.key, this.expire)
			.exec();
		return this.#getFailCount();
	}

	async isLock() {
		const failedCount = await this.#getFailCount();
		return failedCount >= this.failLimitCount;
	}

	async #getFailCount() {
		const count = await this.redis.get(this.key);
		return count || 0;
	}

	async reset() {
		await this.redis.del(this.key);
	}
}
