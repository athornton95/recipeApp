const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Recipe = require('../models/Recipe');
const Comment = require('../models/Comment');




router.get('/', (req, res) => {
    User.find({}, (err, usersOnTheDatabase) => {
        if(err){
            res.send(err);
            console.log(err);
        } else {
            res.render('users/index.ejs', {
                usersOnTheTemplate: usersOnTheDatabase,
                userOnTheTemplate: req.session.usersDbId,
                logged: req.session.logged,
                username: req.session.username    
            });
        }
    })
})

router.get('/:id', async (req, res) => {
    try{
        const foundUser = await User.findById(req.params.id)

            .populate('recipes')
            .exec();
        res.render('users/show.ejs', {
            user: foundUser,
            userOnTheTemplate: req.session.usersDbId,
            sessionId: req.session.usersDbId,
            logged: req.session.logged,
            username: req.session.username
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
            user: foundUser,
            userOnTheTemplate: req.session.usersDbId,
            username: req.session.username, 
            logged: req.session.logged,
            sessionId: req.session.usersDbId
        })
    } catch(err) {
        res.send(err);
    }
})

router.put('/:id', async (req, res) => {
    try{
        const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {new: true})
        .populate('recipes')
        .exec();
    res.render('users/show.ejs', {
        user: updatedUser,
        userOnTheTemplate: req.session.usersDbId,
        sessionId: req.session.usersDbId,
        logged: req.session.logged,
        username: req.session.username
    });
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
                $in: deletedUser.recipes,

            }
        });

        const deletedComments = await Comment.deleteMany({
            user: {
                $eq: deletedUser._id
            }
        })

        req.session.logged = false;
        res.redirect('/recipes')
    }catch(err){
        console.log(err);
        res.send(err);
    }
})

module.exports = router;