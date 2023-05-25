const router = require('express').Router();

const {
  getCards, deleteCardById, createCard, putLike, removeLike,
} = require('../controllers/cards');
const { joiValidateId, joiValidateCardId, joiValidateCard } = require('../utils/joi-validators');

router.get('/', getCards);

router.delete('/:id', joiValidateId(), deleteCardById);

router.post('/', joiValidateCard(), createCard);

router.put('/:cardId/likes', joiValidateCardId(), putLike);

router.delete('/:cardId/likes', joiValidateCardId(), removeLike);

module.exports = router;
