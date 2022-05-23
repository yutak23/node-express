const data = {
	id: 'id',
	name: { fullName: 'fullName' },
	ttl: 1600000000
};

const mock = jest.fn().mockImplementation(() => ({ putItem: () => data }));

export default mock;
