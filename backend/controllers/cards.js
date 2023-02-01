const BadRequestError = require('../errors/bad-request-err');
const ForbiddenError = require('../errors/forbidden-err');
const NotFoundError = require('../errors/not-found-err');
const Card = require('../models/card');
const User = require('../models/user');
const {
  BAD_REQUEST_MESSAGE,
  NOT_FOUND_MESSAGE_CARD,
  OK,
  OK_MESSAGE,
  CREATED,
  FORBIDDEN_MESSAGE,
} = require('../utils/constants');

const getCards = async (req, res, next) => {
  try {
    const cards = await Card.find({}).populate('owner');
    return res.status(OK).json(cards);
  } catch (e) {
    return next(e);
  }
};

const deleteCardById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const card = await Card.findById(id)
      .orFail(new NotFoundError(NOT_FOUND_MESSAGE_CARD));

    // У пользователя не должно быть возможности удалять карточки других пользователей
    if (req.user._id !== String(card.owner._id)) {
      return next(new ForbiddenError(FORBIDDEN_MESSAGE));
    }

    await card.remove(id);

    return res.status(OK).json({ message: OK_MESSAGE });
  } catch (e) {
    if (e.name === 'CastError') {
      return next(new BadRequestError(BAD_REQUEST_MESSAGE));
    }
    return next(e);
  }
};

const createCard = async (req, res, next) => {
  try {
    const cardOwner = await User.findById(req.user._id);
    const card = await Card.create({ owner: cardOwner, ...req.body });
    return res.status(CREATED).json(card);
  } catch (e) {
    if (e.name === 'ValidationError') {
      const errors = Object.values(e.errors).map((err) => err.message);
      return next(new BadRequestError(errors.join(', ')));
    }
    return next(e);
  }
};

const putLike = async (req, res, next) => {
  try {
    const { cardId } = req.params;

    const cardWithLike = await Card.findByIdAndUpdate(
      cardId,
      { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
      { new: true }, // обработчик then получит на вход обновлённую запись
    )
      .populate('owner')
      .orFail(new NotFoundError(NOT_FOUND_MESSAGE_CARD));

    return res.status(CREATED).json(cardWithLike);
  } catch (e) {
    if (e.name === 'CastError') {
      return next(new BadRequestError(BAD_REQUEST_MESSAGE));
    }
    return next(e);
  }
};

const removeLike = async (req, res, next) => {
  try {
    const { cardId } = req.params;

    const cardWithoutLike = await Card.findByIdAndUpdate(
      cardId,
      { $pull: { likes: req.user._id } }, // убрать _id из массива
      { new: true }, // обработчик then получит на вход обновлённую запись
    )
      .populate('owner')
      .orFail(new NotFoundError(NOT_FOUND_MESSAGE_CARD));

    return res.status(OK).json(cardWithoutLike);
  } catch (e) {
    if (e.name === 'CastError') {
      return next(new BadRequestError(BAD_REQUEST_MESSAGE));
    }
    return next(e);
  }
};

module.exports = {
  getCards,
  deleteCardById,
  createCard,
  putLike,
  removeLike,
};
