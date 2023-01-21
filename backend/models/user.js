const mongoose = require('mongoose');
const validator = require('validator');
const { REGEX_URL } = require('../utils/constants');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      minLength: 2,
      maxLength: 30,
      default: 'Жак-Ив Кусто',
    },
    about: {
      type: String,
      minLength: 2,
      maxLength: 30,
      default: 'Исследователь',
    },
    avatar: {
      type: String,
      // Используем регулярное выражение для валидации поля
      validate: {
        validator: (v) => REGEX_URL.test(v),
        message: (props) => `${props.value} не валидная ссылка`,
      },
      default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    },
    email: {
      type: String,
      unique: true,
      required: true,
      // Используем метод isEmail модуля Validator
      validate: {
        validator: (email) => validator.isEmail(email),
        message: (props) => `${props.value} не валидный email!`,
      },
    },
    password: {
      type: String,
      required: true,
      // По умолчанию хеш пароля пользователя не будет возвращаться из базы
      select: false,
    },
  },
  { versionKey: false },
);

const userModel = mongoose.model('user', userSchema);

module.exports = userModel;
