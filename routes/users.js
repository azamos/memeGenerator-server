var express = require('express');
var router = express.Router();
const {write,read} = require('../services/db');
const getAliases = require('../services/getAliases');
const whereToCollectionName = "users";

router.get('/', (req, res, next) => {
  read(whereToCollectionName)
  .then(users => res.json(users),err=>res.json(err));
});

router.get('/:name',(req,res,next) => {
  read(whereToCollectionName,req.params.name)
  .then(returnValue => res.json([{name: returnValue[0].name,image: returnValue[0].picture.large}]))
    .catch(err => res.send(err));
});

router.get('/:from-:to', (req, res, next) => {
  read(whereToCollectionName,{from:req.params.from, to: req.params.to})
  .then(users => res.json(users))
  .catch(err=>res.json(err));
});

router.post('/',(req,res,next) => {
  for(const user of req.body){
    user.aliases = getAliases(user.name);
  }
  write(req.body, whereToCollectionName)
  .then(users => res.json(users.ops))
  .catch(err => console.log(err));
});

module.exports = router;
