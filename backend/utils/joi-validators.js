const { celebrate, Joi } = require('celebrate');
const { REGEX_URL } = require('./constants');

// Id must be validated as a hex sequence of 24 characters (0-9, A-F)
const joiId = () => Joi.string().length(24).hex().required();

const joiRequiredLink = () => Joi.string().required().pattern(REGEX_URL);
const joiLink = () => Joi.string().pattern(REGEX_URL);

const joiRequiredText = () => Joi.string().required().min(2).max(30);
const joiText = () => Joi.string().min(2).max(30);

const joiEmail = () => Joi.string().required().email();
const joiPassword = () => Joi.string().required();

const joiValidateLogin = () => celebrate({
  body: Joi.object().keys({
    email: joiEmail(),
    password: joiPassword(),
  }),
});

const joiValidateUser = () => celebrate({
  body: Joi.object().keys({
    name: joiText(),
    about: joiText(),
    avatar: joiLink(),
    email: joiEmail(),
    password: joiPassword(),
  }),
});

const joiValidateId = () => celebrate({
  params: Joi.object().keys({
    id: joiId(),
  }),
});

const joiValidateAvatar = () => celebrate({
  body: Joi.object().keys({
    avatar: joiRequiredLink(),
  }),
});

const joiValidateProfile = () => celebrate({
  body: Joi.object().keys({
    name: joiRequiredText(),
    about: joiRequiredText(),
  }),
});

const joiValidateCardId = () => celebrate({
  params: Joi.object().keys({
    cardId: joiId(),
  }),
});

const joiValidateCard = () => celebrate({
  body: Joi.object().keys({
    name: joiRequiredText(),
    link: joiRequiredLink(),
  }),
});

module.exports = {
  joiValidateId,
  joiValidateAvatar,
  joiValidateProfile,
  joiValidateCard,
  joiValidateCardId,
  joiValidateLogin,
  joiValidateUser,
};
