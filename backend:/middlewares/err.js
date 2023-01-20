// Мидлвэр для централизованной обработки ошибок

const { INTERNAL_SERVER_ERROR, INTERNAL_SERVER_ERROR_MESSAGE } = require('../utils/constants');

module.exports = (err, req, res, next) => {
  // если у ошибки нет статуса, выставляем 500
  const { statusCode = INTERNAL_SERVER_ERROR, message } = err;

  res.status(statusCode).json({
    // проверяем статус и выставляем сообщение в зависимости от него
    message: statusCode === INTERNAL_SERVER_ERROR
      ? INTERNAL_SERVER_ERROR_MESSAGE
      : message,
  });

  next();
};
