import fs from 'fs';
import appRoot from 'app-root-path';
import { camelCase } from 'lodash';

export default async () => {
	const routes = {};

	const directoryDirents = fs
		.readdirSync(appRoot.resolve('src/routes'), { withFileTypes: true })
		.filter((dirent) => !dirent.isFile());

	await Promise.all(
		directoryDirents.map(async (dirent) => {
			const module = await import(`./${dirent.name}`);
			routes[camelCase(dirent.name)] = module.default;
		})
	);

	return routes;
};
