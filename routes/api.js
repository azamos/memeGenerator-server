var express = require('express');
var router = express.Router();
const search = require('./search');
const users = require('./users');
const memes = require('./memes');

router.use('/search',search);
router.use('/users',users);
router.use('/memes',memes);

module.exports = router;
