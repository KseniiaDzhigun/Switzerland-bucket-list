const { INTERNAL_SERVER_ERROR, INTERNAL_SERVER_ERROR_MESSAGE } = require('../utils/constants');

module.exports = (err, req, res, next) => {
  // if the error has no status, set 500
  const { statusCode = INTERNAL_SERVER_ERROR, message } = err;

  res.status(statusCode).json({
    // check the status and set the message accordingly
    message: statusCode === INTERNAL_SERVER_ERROR
      ? INTERNAL_SERVER_ERROR_MESSAGE
      : message,
  });

  next();
};
