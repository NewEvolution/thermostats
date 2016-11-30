'use strict';

const express = require('express'),
      app = express(),
      session = require('express-session'),
      RedisStore = require('connect-redis')(session),
      SESS_SECRET = process.env.SESS_SECRET || 'DevPasswordYo',
      REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';
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

const path = require('path'),
      nodeSass = require('node-sass-middleware');
app.use(nodeSass({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  indentedSyntax: true,
  sourceMap: true
}));

app.use(express.static(path.join(__dirname, 'public')));

app.get('*', (req, res) => {
  res.send('You found the marble in the oatmeal!');
});

const db = require('./models/'),
      localPort = 3000,
      PORT = process.env.PORT || localPort;
db.sequelize.sync().then((bloof) => {
  console.log(bloof); // eslint-disable-line no-console
  app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`); // eslint-disable-line no-console
  });
});
