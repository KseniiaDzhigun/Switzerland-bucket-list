const router = require('express').Router();

const {
  getUsers, getUserById, updateUser, updateAvatar, getCurrentUser,
} = require('../controllers/users');
const { joiValidateId, joiValidateAvatar, joiValidateProfile } = require('../utils/joi-validators');

router.get('/', getUsers);
router.get('/me', getCurrentUser);

// Тела, параметры запросов к серверу должны валидироваться до передачи обработки в контроллеры
router.get('/:id', joiValidateId(), getUserById);

router.patch('/me/avatar', joiValidateAvatar(), updateAvatar);

router.patch('/me', joiValidateProfile(), updateUser);

module.exports = router;
