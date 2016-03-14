'use strict'

const router = require('express').Router();

/*const Note = require('../models/note');
router.param('id', (req, res, next, id) => {
  Note
    .findById(id)
    .populate('category')
    .exec((err, note) => {
      if (err) throw err;
      req.note = note;
      next();
    });
});*/

const apiC = require('../controllers/api');
router.get('/', apiC.index)
      .post('/', apiC.new)

module.exports = router;
