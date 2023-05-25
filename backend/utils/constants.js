const BAD_REQUEST_MESSAGE = 'Invalid id sent';
const NOT_FOUND_MESSAGE_USER = 'User not found';
const NOT_FOUND_MESSAGE_CARD = 'Card not found';
const NOT_FOUND_MESSAGE_PATH = 'Path not found';
const INTERNAL_SERVER_ERROR = 500;
const INTERNAL_SERVER_ERROR_MESSAGE = 'An error has occurred';
const OK = 200;
const OK_MESSAGE = 'The post has been deleted';
const CREATED = 201;
const UNAUTHORIZED_MESSAGE_LOGIN = 'Incorrect mail or password';
const UNAUTHORIZED_MESSAGE_AUTH = 'Authorization required';
const FORBIDDEN_MESSAGE = 'You cannot delete other users cards';
const CONFLICT_MESSAGE = 'A user with this email already exists';

const REGEX_URL = /^https?:\/\/(www.)?[\w-.~:/?#[\]@!$&'()*+,;=]+\.[a-zA-z]+(\/[\w-.~:/?#[\]@!$&'()*+,;=]+)*#?$/;

module.exports = {
  BAD_REQUEST_MESSAGE,
  NOT_FOUND_MESSAGE_USER,
  NOT_FOUND_MESSAGE_CARD,
  NOT_FOUND_MESSAGE_PATH,
  INTERNAL_SERVER_ERROR,
  INTERNAL_SERVER_ERROR_MESSAGE,
  OK,
  OK_MESSAGE,
  CREATED,
  UNAUTHORIZED_MESSAGE_LOGIN,
  UNAUTHORIZED_MESSAGE_AUTH,
  FORBIDDEN_MESSAGE,
  CONFLICT_MESSAGE,
  REGEX_URL,
};
