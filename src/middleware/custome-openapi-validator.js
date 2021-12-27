import * as OpenApiValidator from 'express-openapi-validator';
import appRoot from 'app-root-path';
import camelcaseKeys from 'camelcase-keys';
import snakecaseKeys from 'snakecase-keys';

const reqCaseConverter = (basePath) => {
	return (req, res, next) => {
		if (req.originalUrl.startsWith(basePath)) {
			if (req.body) req.body = camelcaseKeys(req.body, { deep: true });
			if (req.query) req.query = camelcaseKeys(req.query);
		}
		next();
	};
};
const resCaseConverter = (basePath) => {
	return (req, res, next) => {
		if (req.originalUrl.startsWith(basePath)) {
			const originFunc = res.json;
			res.json = (data) => {
				return originFunc.call(res, snakecaseKeys(data));
			};
		}
		next();
	};
};

export default (basePath) => {
	const middleware = OpenApiValidator.middleware({
		apiSpec: appRoot.resolve('src/openapi/user.yaml'),
		validateRequests: true,
		validateResponses: true,
		ignorePaths: (p) => !p.startsWith(basePath)
	});

	middleware.push(reqCaseConverter(basePath));
	middleware.push(resCaseConverter(basePath));

	return middleware;
};
