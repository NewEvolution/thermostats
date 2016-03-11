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

const mainC = require('../controllers/main');
router.get('/', mainC.index)
      .get('/new', mainC.new)
      .post('/', mainC.create)
      .get('/:id', mainC.show)
      .get('/:id/edit', mainC.edit)
      .put('/:id', mainC.update)
      .delete('/:id', mainC.delete);

module.exports = router;
