var express = require('express');
var router = express.Router();
const { write, read } = require('../services/db');
const getAliases = require('../services/getAliases');
const whereToCollectionName = "memes";
const saveImage = require('../services/saveImage');

router.post('/', async(req, res, next) => {
  let memes=[];
  let meme = {};
  meme.name = req.body.name;
  meme.description = req.body.description;
  meme.aliases = [];
  meme.aliases = getAliases(meme.name, meme.aliases);
  if (req.files && req.files.image) {
    meme.path = await saveImage(req.files.image);
  }
  memes.push(meme);
  write(memes, whereToCollectionName)
    .then(returnValue => res.json(returnValue.ops))
    .catch(err => res.send(err));
});

router.get('/', (req, res, next) => {
  read(whereToCollectionName)
    .then(returnValue => res.json(returnValue))
    .catch(err => res.send(err));
});

router.get('/:from-:to', (req, res, next) => {
  read(whereToCollectionName, { from: req.params.from, to: req.params.to })
    .then(memes => res.json(memes))
    .catch(err => res.json(err));
});

module.exports = router;
