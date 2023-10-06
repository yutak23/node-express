import { strict as assert } from 'assert';

import openapiValidator from '../../lib/custome-openapi-validator';
import post from './v1/post';

const BASE_V1_API_PATH = `/api/v1/post`;

export default async (options = {}) => {
	assert.ok(options.app, 'app must be required');
	const { app } = options;

	app.use(
		openapiValidator({
			basePath: BASE_V1_API_PATH,
			apiSpec: 'src/openapi/post.v1.yaml'
		})
	);

	app.use(`${BASE_V1_API_PATH}`, post);
};
