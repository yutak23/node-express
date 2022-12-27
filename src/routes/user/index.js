import { strict as assert } from 'assert';
import fs from 'fs';
import appRoot from 'app-root-path';
import { parse } from 'path';

const BASE_V1_API_PATH = `/api/v1`;

export default async (options = {}) => {
	assert.ok(options.app, 'app must be required');
	const { app } = options;

	const fileDirents = fs
		.readdirSync(appRoot.resolve('src/routes/user/v1'), { withFileTypes: true })
		.filter((dirent) => dirent.isFile());

	await Promise.all(
		fileDirents.map(async (dirent) => {
			const pathName = parse(dirent.name).name;
			const module = await import(`./v1/${dirent.name}`);

			app.use(`${BASE_V1_API_PATH}/${pathName}`, module.default);
		})
	);
};
