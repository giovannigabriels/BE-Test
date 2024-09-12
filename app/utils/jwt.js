const jwt = require("jsonwebtoken");
const auth = require("../config/auth");


exports.generateToken = (payload) => {

	return jwt.sign(payload, auth.secret);
};

exports.verifyToken = (token) => {
	return jwt.verify(token, auth.secret);
};