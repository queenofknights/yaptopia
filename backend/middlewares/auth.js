const jwt = require('jsonwebtoken');
const { errorResponse } = require('../utils/responseHandler');

const verifyToken = (req, res, next) => {
  let token;

  // Check headers for Bearer token, fallback to cookies if implemented
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return errorResponse(res, 401, 'Not authorized to access this route - No token provided');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, role, iat, exp }
    next();
  } catch (error) {
    return errorResponse(res, 401, 'Not authorized to access this route - Invalid token');
  }
};

module.exports = { verifyToken };