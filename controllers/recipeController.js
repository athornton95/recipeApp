 const express = require('express');
 const router = express.Router();
 const Recipe = require('../models/Recipe');
 const User = require('../models/User');
 const Comment = require('../models/Comment');
 
 //INDEX route:

router.get('/',  (req, res) => {
    const query = {};
    if(req.query.category){query.category = req.query.category};
    Recipe.find(query,(err, recipesOnTheDatabase) => {
        if(err){
            console.log(err);
            res.send(err);
        } else {
            res.render('recipes/index.ejs', {
               recipesOnTheTemplate: recipesOnTheDatabase,
               logged: req.session.logged,
               username: req.session.username,
               userOnTheTemplate: req.session.usersDbId
            })
        }
    })
})
 
 //NEW route:
 router.get('/new', (req, res) => {
     
    const categories = ['breakfast', 'lunch', 'snacks', 'dinner', 'dessert', 'drinks'];
    res.render('recipes/new.ejs', {
        logged: req.session.logged,
        username: req.session.username,
        categories: categories,
        userOnTheTemplate: req.session.usersDbId
     });
 })

//SHOW route:
 router.get('/:id', async (req, res) => {
     try {
               const recipeFromTheDatabase = await Recipe.findById(req.params.id);
                const user = await User.findOne({"recipes": req.params.id})
                const allComments = await Comment.find({'recipe': req.params.id});
                res.render('recipes/show.ejs', {
                    recipeOnTheTemplate: recipeFromTheDatabase,
                    user: user,
                    logged: req.session.logged,
                    commentsOnTheTemplate: allComments,
                    sessionId: req.session.usersDbId,
                    username: req.session.username,
                    userOnTheTemplate: req.session.usersDbId
                })
     } catch(err){
         console.log(err);
         res.send(err);
     }
 })

 //CREATE route
 router.post('/', async (req, res) => {
    try{
        req.body.user = req.session.username
        const newRecipe = await Recipe.create(req.body);
        const foundUser = await User.findOne({'username': req.session.username})
        foundUser.recipes.push(newRecipe)
        const savedUser = await foundUser.save()
        res.redirect('/recipes')
    }catch(err){
        console.log(err);
        res.send(err);
    }
})

//CREATE comment
router.post('/:id', async (req, res) => {
    try{
        const newComment = await Comment.create(req.body);
        newComment.user = req.session.usersDbId;
        newComment.recipe = req.params.id;
        newComment.username = req.session.username;
        newComment.date = new Date();
        const savedComment = await newComment.save();
        const user = await User.findOne({"recipes": req.params.id})
        const foundRecipe = await Recipe.findById(req.params.id);
        foundRecipe.comments.push(newComment._id);
        const savedRecipe = await foundRecipe.save();
        const allComments = await Comment.find({'recipe': req.params.id});
        res.render('recipes/show.ejs', {
            recipeOnTheTemplate: foundRecipe,
            commentsOnTheTemplate: allComments,
            user: user,
            logged: req.session.logged,
            sessionId: req.session.usersDbId,
            username: req.session.username,
            userOnTheTemplate: req.session.usersDbId
    })
    }catch(err){
        console.log(err);
        res.send(err);
    } 
})


//EDIT route
router.get('/:id/edit', async (req, res) => {
    try{
        const foundRecipe = await Recipe.findById(req.params.id)
        // const foundUser = await User.findOne({'recipes': req.params.id})
        res.render('recipes/edit.ejs', {
            recipeOnTheTemplate: foundRecipe,
            userOnTheTemplate: req.session.usersDbId,
            username: req.session.username,
            logged: req.session.logged
        })
    }catch(err){
        res.send(err)
    }
})


//UPDATE route
router.put('/:id', async (req, res) => {
    try{
        const updatedRecipe = await Recipe.findByIdAndUpdate(req.params.id, req.body, {new: true})
        res.redirect('/recipes')

    }catch(err){
        res.send(err)
    }
})

//DELETE route:
router.delete('/:id', async (req, res) => {
    try{
        const deletedRecipe = await Recipe.findByIdAndDelete(req.params.id)
        const foundUser = await User.findOne({'recipes': req.params.id})
        foundUser.recipes.remove(req.params.id)
        const savedUser = await foundUser.save()
        res.redirect('/recipes')

    }catch(err){
        res.send(err)
    }
})

router.delete('/:id/:comment', async (req, res) => {
    const deletedComment = await Comment.findByIdAndDelete(req.params.comment);
    const foundRecipe = await Recipe.findById(req.params.id);
    foundRecipe.comments.remove(req.params.comment);
    const savedRecipe = await foundRecipe.save();
    const user = await User.findOne({"recipes": req.params.id})
    const allComments = await Comment.find({'recipe': req.params.id});
    res.render('recipes/show.ejs', {
        recipeOnTheTemplate: foundRecipe,
        commentsOnTheTemplate: allComments,
        user: user,
        logged: req.session.logged,
        sessionId: req.session.usersDbId,
        username: req.session.username
    })
})


 module.exports = router;