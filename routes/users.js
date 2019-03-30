var express = require('express');
var router = express.Router();
const {write,read} = require('../services/db');
const whereToCollectionName = "users";

router.get('/', (req, res, next) => {
  read(whereToCollectionName)
  .then(users => res.json(users),err=>res.json(err));
});

// router.get('/:from-:to', (req, res, next) => {
//   read(whereToCollectionName,{from:req.params.from, to: req.params.to})
//   .then(users => res.json(users),err=>res.json(err));
// });

router.post('/',(req,res,next) => {
  write(req.body, whereToCollectionName)
  .then(users => res.json(users), err=> res.json(err));
});

module.exports = router;
