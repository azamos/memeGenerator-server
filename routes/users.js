var express = require('express');
var router = express.Router();
const { write, read, update } = require('../services/db');
const getAliases = require('../services/getAliases');
const whereToCollectionName = "users";
const MD5 = require('md5');
const saveImage = require('../services/saveImage');
const User = require('../entities/User');
//const autherizedSecret = '5ebe2294ecd0e0f08eab7690d2a6ee69'; TODO: when done with server, push all constants to a folder of their own.

router.get('/', (req, res, next) => {
  read(whereToCollectionName)
    .then(users => res.json(users), err => res.json(err));
});

router.post('/', async (req, res, next) => {
  const user = req.body;//Add a User data type.
  user.password = MD5(user.password);
  user.image="";
  if (req.files && req.files.image) {
    user.image = await saveImage(req.files.image)
  }
  //Now to see if there is allready a user with said name and/or password.
  write([new User(user.name,user.email,user.password,user.image)], 'users')//done: add unique to email and username.
    .then(returnValue => {
      const newUser = returnValue.ops[0];
      return res.json([{ name: newUser.name, image: newUser.image }])
    })
    .catch(err => {
      console.log(err);//TODO: add errors collection? otherwise no tracking of errors.
      return res.json([{ msg: 'a user like that allready exists' }])
    });
});



router.get('/:name', (req, res, next) => {//TODO: think about findoneandupdate, with query === {name,password}. if can't find, then it means that either uName or Pass
  //are incorrect. but then how do I lock user? since it wont find any if pass is incorrect.
  let [name, password] = req.params.name.split('&');//TODO: pass validation to a MW, since all requests of this nature must recieve the same treatment.
  //also, use req params instead of split, with proper syntax, say something like :name-:pass or some such.
  password = MD5(password);
  delete req.params.name;//kill any trace of unencrypted password
  read(whereToCollectionName, name)
    .then(returnValue => {
      let matchinguser = returnValue[0];
      if (matchinguser.isLocked) {
        return res.json({ msg: `account locked. a message was sent to ${matchinguser.email}` })//TODO: check if GMAIL api will allow to send email from here or if I have
        //to set up an SMTP server for this sort of thing.
      }
      if (matchinguser.password === password) {
        update(name, { lastLogin: Date.now() }, 'users')//TODO: add a collection to keep track of all attempted logins. is this what companies like FB do?
          .then(res => console.log(res))
          .catch(err => console.log(err));
        return res.json([{ name: matchinguser.name, image: matchinguser.image }]);//return only the necessary bits. for now, name and image. Also, dont wait for update.
      }
      //Note: if req got here, it means account is not locked and password is incorrect.
      //therefore, increase numberOfFails and check if needs to locks. 
      //TODO: add a resetDate, that if a user is not locked, resets his numberOfFails or some such.
      let changes = { numberOfFails: matchinguser.numberOfFails + 1 };
      //TODO: Here send request to change numberOfFails, and if > 4 than set to lock.
      if (matchinguser.numberOfFails >= 4) {//instead of a hardcoded number, add a constant, or better, create USER class and add USER.lockLimit = 4 .
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
