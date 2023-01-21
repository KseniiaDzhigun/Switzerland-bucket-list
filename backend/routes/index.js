const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { login, createUser } = require('../controllers/users');
const auth = require('../middlewares/auth');
const userRouter = require('./users');
const cardRouter = require('./cards');
const { REGEX_URL } = require('../utils/constants');

router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);

router.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(REGEX_URL),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), createUser);

// Роут signout, который очищает куки
router.get('/signout', (req, res) => {
  res.clearCookie('jwt').send({ message: 'Выход' });
});

// Защищаем авторизацией все маршруты, кроме страницы регистрации и логина
router.use(auth);

router.use('/users', userRouter);
router.use('/cards', cardRouter);

module.exports = router;
