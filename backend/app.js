const express = require('express');
require('dotenv').config();
const cookieParser = require('cookie-parser');

const mongoose = require('mongoose');
const { errors } = require('celebrate');
const cors = require('cors');

const { PORT, DB_URL } = process.env;
const router = require('./routes');
const { NOT_FOUND_MESSAGE_PATH } = require('./utils/constants');
const NotFoundError = require('./errors/not-found-err');
const err = require('./middlewares/err');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const app = express();
app.use(cookieParser()); // Объект req будет обогащаться cookies
app.use(cors({ origin: ['http://localhost:3001', 'https://dzhigun.students.nomoredomains.rocks'], credentials: true, maxAge: 60 }));

app.use(express.json()); // It parses incoming JSON requests and puts the parsed data in req.body
app.use(requestLogger); // подключаем логгер запросов

// Необработанная ошибка в Node.js - событие uncaughtException, процесс завершится
// Теперь при GET-запросе на URL /crash-test сервер будет падать. Pm2 должен его восстанавливать.
// После прохождения тестов удалить!
app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

// за ним идут все обработчики роутов
app.use('/', router);
app.use('*', (req, res, next) => next(new NotFoundError(NOT_FOUND_MESSAGE_PATH)));

app.use(errorLogger); // подключаем логгер ошибок

// Обработчик ошибок celebrate
app.use(errors());

// Централизованный обработчик ошибок
app.use(err);

mongoose.connect(DB_URL, {
  useNewUrlParser: true,
}, () => {
  console.log('Connected to MongoDB');
  app.listen(PORT, () => {
    console.log(`App listening on ${PORT}`);
  });
});
