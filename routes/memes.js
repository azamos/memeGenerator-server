var express = require('express');
var router = express.Router();
const {write,read} = require('../services/db');
const getAliases = require('../services/getAliases');
const whereToCollectionName = "memes";

router.post('/',(req,res,next)=>{
    for(const user of req.body){
        user.aliases = [];
        user.aliases = getAliases(user.name,user.aliases);
      }
     write(req.body, whereToCollectionName)
    .then(returnValue => res.json(returnValue.ops))
    .catch(err=> res.send(err));
});

router.get('/',(req,res,next)=>{
    read(whereToCollectionName)
    .then(returnValue => res.json(returnValue))
    .catch(err=> res.send(err));
});

router.get('/:from-:to', (req, res, next) => {
    read(whereToCollectionName,{from:req.params.from, to: req.params.to})
    .then(memes => res.json(memes))
    .catch(err=>res.json(err));
  });

module.exports = router;
