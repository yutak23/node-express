export default () => (req, res, next) => {
	res.error = (error) => {
		console.log(error);

		if (error.status) res.status(error.status);
		if (!res.statusCode) res.status(500);

		res.json({
			message: error.message,
			status_code: res.statusCode,
			path: `${req.method}:${req.originalUrl}`
		});
	};
	next();
};
