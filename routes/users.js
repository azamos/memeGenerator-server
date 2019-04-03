var express = require('express');
var router = express.Router();
const { write, read, update } = require('../services/db');
const getAliases = require('../services/getAliases');
const whereToCollectionName = "users";
const MD5 = require('md5');
//const autherizedSecret = '5ebe2294ecd0e0f08eab7690d2a6ee69';

router.get('/', (req, res, next) => {
  read(whereToCollectionName)
    .then(users => res.json(users), err => res.json(err));
});

router.get('/:name', (req, res, next) => {
  let [name, password] = req.params.name.split('&');//TODO: pass validation to a MW, since all requests of this nature must recieve the same treatment
  password = MD5(password);
  delete req.params.name;//kill any trace of unencrypted password
  read(whereToCollectionName, name)
    .then(returnValue => {
      let matchinguser = returnValue[0];
      if (matchinguser.isLocked) {
        return res.json({ msg: `account locked. a message was sent to ${matchinguser.email}` })
      }
      if (matchinguser.password === password) {
        update(name, { lastLogin: Date.now() }, 'users')
          .then(res => console.log(res))
          .catch(err => console.log(err));
        return res.json([{ name: matchinguser.name, image: matchinguser.image }]);//return only the necessary bits. for now, name and image
      }
      let changes = { numberOfFails: matchinguser.numberOfFails + 1 };
      //TODO: Here send request to change numberOfFails, and if > 4 than set to lock. do it smart
      if (matchinguser.numberOfFails >= 4) {//instead ondf hardcoded number, add constant, or better, create USER class and add USER.lockLimit = 4 .
        changes.isLocked = true
      }
      update(name, changes, 'users')
        .then(res => console.log(res))
        .catch(err => console.log(err));//NO NEED to wait for it to finish before sending response to the client
      return res.json({ msg: 'wrong password' })
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
