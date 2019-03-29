var express = require('express');
var router = express.Router();
const {write,read} = require('../services/db');
const whereToCollectionName = "memes";

router.post('/',(req,res,next)=>{
    write(req.body,whereToCollectionName)
    .then(returnValue => {
        res.send(JSON.stringify(returnValue.ops));})
    .catch(err=> res.send(err));
});

router.get('/',(req,res,next)=>{
    read(whereToCollectionName)
    .then(returnValue => res.send(JSON.stringify(returnValue)))
    .catch(err=> res.send(err));
});

module.exports = router;
