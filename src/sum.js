export default async (a, b) => {
	await new Promise((resolve) => {
		setTimeout(() => {
			resolve('sleep');
		}, 500);
	});
	return a + b;
};
