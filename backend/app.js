const express = require('express');
require('dotenv').config();
const cookieParser = require('cookie-parser');

const mongoose = require('mongoose');
const { errors } = require('celebrate');
const { errorLogger } = require('express-winston');
const cors = require('cors');
const router = require('./routes');
const { NOT_FOUND_MESSAGE_PATH } = require('./utils/constants');
const NotFoundError = require('./errors/not-found-err');
const err = require('./middlewares/err');
const { requestLogger } = require('./middlewares/logger');

const PORT = 3000;

const app = express();
app.use(cookieParser()); // Объект req будет обогащаться cookies
app.use(cors({ origin: ['http://localhost:3001', 'https://dzhigun.students.nomoredomains.rocks'], credentials: true, maxAge: 60 }));

app.use(express.json()); // It parses incoming JSON requests and puts the parsed data in req.body
app.use(requestLogger); // подключаем логгер запросов

// за ним идут все обработчики роутов
app.use('/', router);
app.use('*', (req, res, next) => next(new NotFoundError(NOT_FOUND_MESSAGE_PATH)));

app.use(errorLogger); // подключаем логгер ошибок

// Обработчик ошибок celebrate
app.use(errors());

// Централизованный обработчик ошибок
app.use(err);

mongoose.connect('mongodb://127.0.0.1:27017/mestofull', {
  useNewUrlParser: true,
}, () => {
  console.log('Connected to MongoDB');
  app.listen(PORT, () => {
    console.log(`App listening on ${PORT}`);
  });
});
