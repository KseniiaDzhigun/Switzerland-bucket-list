const { NODE_ENV, JWT_SECRET } = process.env;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const BadRequestError = require('../errors/bad-request-err');
const ConflictError = require('../errors/conflict-err');
const NotFoundError = require('../errors/not-found-err');
const UnauthorizedError = require('../errors/unauthorized-err');
const User = require('../models/user');

const {
  BAD_REQUEST_MESSAGE,
  NOT_FOUND_MESSAGE_USER,
  OK,
  CREATED,
  UNAUTHORIZED_MESSAGE_LOGIN,
  CONFLICT_MESSAGE,
} = require('../utils/constants');

const getUsers = async (req, res, next) => {
  try {
    const users = await User.find({});
    return res.status(OK).json(users);
  } catch (e) {
    // Call next with an error argument - the request will go to the error handler
    return next(e);
  }
};

const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id)
      .orFail(new NotFoundError(NOT_FOUND_MESSAGE_USER));
    // orFail replaces  if (!user) {
    //   return next(new NotFoundError(NOT_FOUND_MESSAGE_USER));
    // }

    return res.status(OK).json(user);
  } catch (e) {
    if (e.name === 'CastError') {
      return next(new BadRequestError(BAD_REQUEST_MESSAGE));
    }
    return next(e);
  }
};

const getCurrentUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id)
      .orFail(new NotFoundError(NOT_FOUND_MESSAGE_USER));

    return res.status(OK).json(user);
  } catch (e) {
    return next(e);
  }
};

const createUser = async (req, res, next) => {
  try {
    const {
      name, about, avatar, email, password,
    } = req.body;
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({
      name, about, avatar, email, password: hash,
    });
    return res.status(CREATED).json({
      name: user.name,
      about: user.about,
      avatar: user.avatar,
      email: user.email,
      _id: user.id,
    });
  } catch (e) {
    if (e.code === 11000) {
      return next(new ConflictError(CONFLICT_MESSAGE));
    }
    if (e.name === 'ValidationError') {
      const errors = Object.values(e.errors).map((err) => err.message);
      return next(new BadRequestError(errors.join(', ')));
    }
    return next(e);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const { name, about } = req.body;
    const user = await User.findByIdAndUpdate(req.user._id, { name, about }, {
      new: true, // then handler will receive the updated record as input
      runValidators: true, // data will be validated before changing
    })
      .orFail(new NotFoundError(NOT_FOUND_MESSAGE_USER));

    return res.status(OK).json(user);
  } catch (e) {
    if (e.name === 'ValidationError') {
      const errors = Object.values(e.errors).map((err) => err.message);
      return next(new BadRequestError(errors.join(', ')));
    }
    return next(e);
  }
};

const updateAvatar = async (req, res, next) => {
  try {
    const { avatar } = req.body;
    const user = await User.findByIdAndUpdate(req.user._id, { avatar }, {
      new: true,
      runValidators: true,
    })
      .orFail(new NotFoundError(NOT_FOUND_MESSAGE_USER));

    return res.status(OK).json(user);
  } catch (e) {
    if (e.name === 'ValidationError') {
      const errors = Object.values(e.errors).map((err) => err.message);
      return next(new BadRequestError(errors.join(', ')));
    }
    return next(e);
  }
};

const login = async (req, res, next) => {
  try {
    const {
      email, password,
    } = req.body;
    // Here in the user object will be the password hash
    const user = await User.findOne({ email }).select('+password')
      .orFail(new UnauthorizedError(UNAUTHORIZED_MESSAGE_LOGIN));

    const matched = await bcrypt.compare(password, user.password);
    if (!matched) {
      return next(new UnauthorizedError(UNAUTHORIZED_MESSAGE_LOGIN));
    }
    const token = jwt.sign(
      { _id: user._id },
      NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
      { expiresIn: '7d' },
    );
    // Write JWT in httpOnly Cookies
    return res
      .cookie('jwt', token, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
        sameSite: true,
      })
      // .send({ message: 'Token is written' });
      .status(OK).json({
        name: user.name,
        about: user.about,
        avatar: user.avatar,
        email: user.email,
        _id: user.id,
      });
  } catch (e) {
    return next(e);
  }
};

module.exports = {
  login,
  getUsers,
  getUserById,
  getCurrentUser,
  createUser,
  updateUser,
  updateAvatar,
};
