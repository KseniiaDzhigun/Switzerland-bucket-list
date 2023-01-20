const mongoose = require('mongoose');
const validator = require('validator');

const cardSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: 2,
    maxLength: 30,
  },
  link: {
    type: String,
    required: true,
    // Используем метод isURL модуля Validator
    validate: {
      validator: (link) => validator.isURL(link),
      message: (props) => `${props.value} не валидная ссылка!`,
    },
  },
  // Настраиваем связь двух схем card и user
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  likes: {
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
      },
    ],
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const cardModel = mongoose.model('card', cardSchema);

module.exports = cardModel;
