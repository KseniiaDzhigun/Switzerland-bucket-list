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
    validate: {
      validator: (link) => validator.isURL(link),
      message: (props) => `${props.value} не валидная ссылка!`,
    },
  },
  // Set up communication between the two schemes card and user
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
