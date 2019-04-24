const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Recipe = require('../models/Recipe');

router.get('/', (req, res) => {
    console.log(req.session);
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
    console.log(req.session);
    try{
        const foundUser = await User.findById(req.params.id);
            // console.log(foundUser._id);
            // console.log(req.session);
            // console.log(req.sessionID);
            console.log(foundUser._id);
            console.log(req.session.usersDbId);
            console.log(req.session.logged);
            console.log(foundUser);
        res.render('users/show.ejs', {
            userOnTheTemplate: foundUser,
            sessionId: req.session.usersDbId,
            logged: req.session.logged
        });
    } catch(err){
        console.log(err);
        res.send(err);
    }
})

router.get('/:id/edit', async (req, res) => {
    try{
        const foundUser = await User.findById(req.params.id);
        res.render('users/edit.ejs', {
            userOnTheTemplate: foundUser
        })
    } catch(err) {
        res.send(err);
    }
})

router.put('/:id', async (req, res) => {
    try{
        const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {new: true});
        res.redirect('/users');
    } catch(err){
        console.log(err);
        res.send(err);
    }
})

router.delete('/:id', async (req, res) => {
    try{
        const deletedUser = await User.findByIdAndDelete(req.params.id);
        const deletedRecipes = await Recipe.deleteMany({
            _id: {
                $in: deletedUser.recipes
            }
        })
        res.redirect('/users')
    }catch(err){
        console.log(err);
        res.send(err);
    }
})






module.exports = router;