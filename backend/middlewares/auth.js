// Миддлвэр для защиты авторизацией всех маршрутов, кроме страницы регистрации и логина
const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/unauthorized-err');
const {
  UNAUTHORIZED_MESSAGE_AUTH,
} = require('../utils/constants');

const JWT_SECRET = 'e227050e57812d82451696746263de45d9e20926b9cbdfa29ecdbba5ac7a3cfe';

// eslint-disable-next-line consistent-return
module.exports = (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) {
    return next(new UnauthorizedError(UNAUTHORIZED_MESSAGE_AUTH));
  }
  let payload;

  try {
    payload = jwt.verify(
      token,
      JWT_SECRET,
    );
  } catch (err) {
    return next(new UnauthorizedError(UNAUTHORIZED_MESSAGE_AUTH));
  }
  req.user = payload; // записываем пейлоуд в объект запроса, в нашем случае id

  next(); // пропускаем запрос дальше
};
