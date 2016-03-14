'use strict';

const express = require('express');
const app = express();

const session = require('express-session');
const RedisStore = require('connect-redis')(session);
const SESS_SECRET = process.env.SESS_SECRET || 'DevPasswordYo';
const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379'
app.use(session({
  secret: SESS_SECRET,
  resave: false,
  saveUninitialized: true,
  store: new RedisStore({
    url: REDIS_URL
  })
}));

const logger = require('./lib/logger');
app.use(logger);

const apiR = require('./routes/api');
app.use(apiR);

app.get('*', (req, res) => {
  res.redirect('https://www.google.com');
});

const mongoose = require('mongoose');
const localMongoPort = 27017;
const MONGO_PORT = process.env.MONGO_PORT || localMongoPort;
const MONGO_HOST = process.env.MONGO_HOST || 'localhost';
const MONGO_USER = process.env.MONGO_USER || '';
const MONGO_PASS = process.env.MONGO_PASS || '';
const MONGO_AUTH = MONGO_USER ? `${MONGO_USER}:${MONGO_PASS}@` : '';
const MONGO_URL = `mongodb://${MONGO_AUTH}${MONGO_HOST}:${MONGO_PORT}/thermostats`;
mongoose.connect(MONGO_URL);

const localPort = 3000;
const PORT = process.env.PORT || localPort;
mongoose.connection.on('open', err => {
  if (err) throw err;
  app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`); // eslint-disable-line no-console
  });
});
