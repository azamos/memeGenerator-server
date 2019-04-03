var express = require('express');
var router = express.Router();
const { write, read } = require('../services/db');
const getAliases = require('../services/getAliases');
const whereToCollectionName = "users";
const MD5 = require('md5');

router.get('/', (req, res, next) => {
  read(whereToCollectionName)
    .then(users => res.json(users), err => res.json(err));
});

router.get('/:name', (req, res, next) => {
  let [name,password] = req.params.name.split('&');
  password = MD5(password);
  delete req.params.name;//kill any trace of unencrypted password
  read(whereToCollectionName, name)
    .then(returnValue => {
      let matchinguser = returnValue[0];
      if (matchinguser.password === password) {
        return res.json([{ name: matchinguser.name, image: matchinguser.image }]);//return only the necessary bits. for now, name and image
      }
      throw new Error('Error: incorrect password');
    })
    .catch(err => res.send(err));
});

router.get('/:from-:to', (req, res, next) => {
  read(whereToCollectionName, { from: req.params.from, to: req.params.to })
    .then(users => res.json(users))
    .catch(err => res.json(err));
});

router.post('/', (req, res, next) => {
  for (const user of req.body) {
    user.aliases = getAliases(user.name);
  }
  write(req.body, whereToCollectionName)
    .then(users => res.json(users.ops))
    .catch(err => console.log(err));
});

module.exports = router;
