const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {

	let token;
	if (req.headers.authorization && req.headers.authorizatioin.startsWith('Bearer')) {
		try {
			token = req.headers.authorizatioin.split(' ')[1];

			const decoded = jwt.verify(token, process.env.JWT_SECRET);
			req.user = decoded.user;
			next();
		} catch (error) {
			res.status(401).json({ message: 'Not authorized, token failed' });
		}

	}
	if (!token) {
		res.status(401).json({ message: 'Not authorized, no token' });
	}
};
