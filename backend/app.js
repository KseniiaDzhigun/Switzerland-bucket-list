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
app.use(cookieParser()); // The object req will be enriched with cookies
app.use(cors({ origin: ['http://localhost:3001', 'https://dzhigun.students.nomoredomains.rocks'], credentials: true, maxAge: 60 }));

app.use(express.json()); // It parses incoming JSON requests and puts the parsed data in req.body
app.use(requestLogger);

app.use('/', router);
app.use('*', (req, res, next) => next(new NotFoundError(NOT_FOUND_MESSAGE_PATH)));

app.use(errorLogger);

// Celebrate error handler
app.use(errors());

// Centralised error handler
app.use(err);

mongoose.connect(DB_URL, {
  useNewUrlParser: true,
}, () => {
  console.log('Connected to MongoDB');
  app.listen(PORT, () => {
    console.log(`App listening on ${PORT}`);
  });
});
