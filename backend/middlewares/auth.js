// Миддлвэр для защиты авторизацией всех маршрутов, кроме страницы регистрации и логина
const jwt = require('jsonwebtoken');

const { NODE_ENV, JWT_SECRET } = process.env;
const UnauthorizedError = require('../errors/unauthorized-err');
const {
  UNAUTHORIZED_MESSAGE_AUTH,
} = require('../utils/constants');

module.exports = (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) {
    return next(new UnauthorizedError(UNAUTHORIZED_MESSAGE_AUTH));
  }
  let payload;

  try {
    payload = jwt.verify(
      token,
      NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
    );
  } catch (err) {
    return next(new UnauthorizedError(UNAUTHORIZED_MESSAGE_AUTH));
  }
  req.user = payload; // write payload to the request object, in this case id

  return next();
};
