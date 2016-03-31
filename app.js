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

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const apiR = require('./routes/api');
app.use(apiR);

const path = require('path');
app.use(express.static(path.join(__dirname, 'public')));

app.get('*', (req, res) => {
  res.send('You found the marble in the oatmeal!');
});

const db = require('./models/');
const localPort = 3000;
const PORT = process.env.PORT || localPort;
db.sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`); // eslint-disable-line no-console
  });
});
