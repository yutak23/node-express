import { strict as assert } from 'assert';

import openapiValidator from '../../lib/custome-openapi-validator';
import user from './v1/user';
import users from './v1/users';

const BASE_V1_API_PATH = `/api/v1/user`;

export default async (options = {}) => {
	assert.ok(options.app, 'app must be required');
	const { app } = options;

	app.use(
		openapiValidator({
			basePath: BASE_V1_API_PATH,
			apiSpec: 'src/openapi/user.yaml'
		})
	);

	app.use(`${BASE_V1_API_PATH}`, user);
	app.use(`${BASE_V1_API_PATH}s`, users);
};
