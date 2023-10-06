import { strict as assert } from 'assert';

import signin from './v1/signin';

const BASE_V1_API_PATH = `/api/v1/internal/signin`;

export default async (options = {}) => {
	assert.ok(options.app, 'app must be required');
	const { app } = options;

	app.use(`${BASE_V1_API_PATH}`, signin);
};
