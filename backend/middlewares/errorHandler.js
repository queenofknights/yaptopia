const { errorResponse } = require('../utils/responseHandler');

const globalErrorHandler = (err, req, res, next) => {
  console.error(`[Error] ${err.message}\n${err.stack}`);

  const statusCode = err.statusCode || 500;
  const message = err.isOperational ? err.message : 'Internal Server Error';

  return errorResponse(res, statusCode, message);
};

module.exports = globalErrorHandler;