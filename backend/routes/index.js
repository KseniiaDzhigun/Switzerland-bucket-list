const router = require('express').Router();
const { login, createUser } = require('../controllers/users');
const auth = require('../middlewares/auth');
const userRouter = require('./users');
const cardRouter = require('./cards');
const { joiValidateUser, joiValidateLogin } = require('../utils/joi-validators');

router.post('/signin', joiValidateLogin(), login);

router.post('/signup', joiValidateUser(), createUser);

// Роут signout, который очищает куки
router.get('/signout', (req, res) => {
  res.clearCookie('jwt').send({ message: 'Выход' });
});

// Защищаем авторизацией все маршруты, кроме страницы регистрации и логина
router.use(auth);

router.use('/users', userRouter);
router.use('/cards', cardRouter);

module.exports = router;
