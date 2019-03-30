var express = require('express');
var router = express.Router();
var path = require('path');
const { read } = require('../services/db');
const memes = "memes";
const users = "users";
//const meme = path.join(memes,':name');
//const user = path.join(users,':name');
const memesUrl = 'http://localhost:3000/api/memes';
const usersUrl = 'http://localhost:3000/api/users';

router.get('/:partialString', (req, res, next) => {
    let suggestionsList = [];
    if (memes.includes(req.params.partialString)) {   //say on client side: onChange => fetch(`http://localhost:3000
        //    /api/search/${e.target.value}`) and e.t.v === 'm'||'me'||'mem'||'meme'|'memes'
        suggestionsList.push(memesUrl);
    }
    if (users.includes(req.params.partialString)) {     //say on client side: onChange => fetch(`http://localhost:3000
        //    /api/search/${e.target.value}`) and e.t.v === 'u'||'us'||'use'||'user'||'users'
        suggestionsList.push(usersUrl);
    }
    Promise.all([//Explanation: say I have both a user that start with 'cookie', and a meme, I would like to present them both as autoComplete.
        read(memes, req.params.partialString)
            .then(retrievedMemes => {
                console.log(retrievedMemes);
                suggestionsList.push(...retrievedMemes);
            },
                err => console.log('not found', err)),
        read(users, req.params.partialString)
            .then(retrievedUsers => {
                console.log(retrievedUsers);
                suggestionsList.push(...retrievedUsers);
            },
                err => (console.log('not found', err)))
    ])
        .then(() => res.json(suggestionsList));
});

module.exports = router;
