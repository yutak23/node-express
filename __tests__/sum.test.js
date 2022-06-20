import sum from '../src/sum';

test('adds 1 + 2 to equal 3', async () => {
	await expect(sum(1, 2)).resolves.toBe(3);
});
