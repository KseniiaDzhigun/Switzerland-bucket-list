const mongoose = require('mongoose');
const validator = require('validator');
const { REGEX_URL } = require('../utils/constants');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      minLength: 2,
      maxLength: 30,
      default: 'My name is ...',
    },
    about: {
      type: String,
      minLength: 2,
      maxLength: 30,
      default: 'I am Explorer',
    },
    avatar: {
      type: String,
      validate: {
        validator: (v) => REGEX_URL.test(v),
        message: (props) => `${props.value} link is not valid`,
      },
      default: 'https://i.postimg.cc/qBFHnczL/interlaken-hiking-guide-hikes-near-interlaken-04228.jpg',
    },
    email: {
      type: String,
      unique: true,
      required: true,
      validate: {
        validator: (email) => validator.isEmail(email),
        message: (props) => `${props.value} email is not valid!`,
      },
    },
    password: {
      type: String,
      required: true,
      // By default the user password hash will not be returned from the database
      select: false,
    },
  },
  { versionKey: false },
);

const userModel = mongoose.model('user', userSchema);

module.exports = userModel;
