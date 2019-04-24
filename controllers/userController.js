const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Recipe = require('../models/Recipe');

router.get('/', (req, res) => {
    User.find({}, (err, usersOnTheDatabase) => {
        if(err){
            res.send(err);
            console.log(err);
        } else {
            res.render('users/index.ejs', {
                usersOnTheTemplate: usersOnTheDatabase
            });
        }
    })
})

router.get('/:id', async (req, res) => {
    try{
        const foundUser = await User.findById(req.params.id);
        res.render('users/show.ejs', {
            userOnTheTemplate: foundUser
        });
    } catch(err){
        res.send(err);
    }
})








module.exports = router;