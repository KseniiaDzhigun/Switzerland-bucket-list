const router = require('express').Router();

const { celebrate, Joi } = require('celebrate');
const {
  getCards, deleteCardById, createCard, putLike, removeLike,
} = require('../controllers/cards');
const { REGEX_URL } = require('../utils/constants');

router.get('/', getCards);

// Тела, параметры запросов к серверу должны валидироваться до передачи обработки в контроллеры
router.delete('/:id', celebrate({
  params: Joi.object().keys({
    // Id необходимо валидировать как hex последовательность длиной 24 символа (0-9, A-F)
    id: Joi.string().length(24).hex().required(),
  }),
}), deleteCardById);

router.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().pattern(REGEX_URL),
  }),
}), createCard);

router.put('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().length(24).hex().required(),
  }),
}), putLike);

router.delete('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().length(24).hex().required(),
  }),
}), removeLike);

module.exports = router;
