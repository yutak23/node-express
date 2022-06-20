import Redis from 'ioredis';
import LoginLock from '../../src/lib/login-lock';

const mockGet = jest.fn();
jest.mock('ioredis', () =>
	jest.fn().mockImplementation(() => ({
		pipeline: jest.fn().mockReturnThis(),
		incr: jest.fn().mockReturnThis(),
		expire: jest.fn().mockReturnThis(),
		exec: jest.fn(() => undefined),
		get: mockGet
	}))
);

describe('login lock', () => {
	beforeEach(() => {
		Redis.mockClear();
		mockGet.mockClear();
	});

	describe('isLock', () => {
		test('return true', async () => {
			mockGet.mockReturnValueOnce(5);

			const loginLock = new LoginLock({ accountId: 'dumy' });
			await expect(loginLock.isLock()).resolves.toBeTruthy();
		});

		test('return false', async () => {
			mockGet.mockReturnValueOnce(4);

			const loginLock = new LoginLock({ accountId: 'dumy' });
			await expect(loginLock.isLock()).resolves.toBeFalsy();
		});

		test('return true with options failLimitCount is 3', async () => {
			mockGet.mockReturnValueOnce(3);

			const loginLock = new LoginLock({ accountId: 'dumy', failLimitCount: 3 });
			await expect(loginLock.isLock()).resolves.toBeTruthy();
		});
	});

	describe('incrFailCount', () => {
		test('return is 1', async () => {
			mockGet.mockReturnValueOnce(1);

			const loginLock = new LoginLock();
			await expect(loginLock.incrFailCount()).resolves.toBe(1);
		});
	});
});
