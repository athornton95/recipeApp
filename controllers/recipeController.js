 const express = require('express');
 const router = express.Router();
 const Recipe = require('../models/Recipe');
 const User = require('../models/User');
 const Comment = require('../models/Comment');
 
 //INDEX route:

router.get('/',  (req, res) => {
    const query = {};
    if(req.query.category){query.category = req.query.category};
    // console.log(query);

    Recipe.find(query,(err, recipesOnTheDatabase) => {
        if(err){
            console.log(err);
            res.send(err);
        } else {
            res.render('recipes/index.ejs', {
               recipesOnTheTemplate: recipesOnTheDatabase,
               logged: req.session.logged,
               username: req.session.username
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
        categories: categories
     });
 })

//SHOW route:
 router.get('/:id', async (req, res) => {
    //  console.log(req.session)
     try {
               const recipeFromTheDatabase = await Recipe.findById(req.params.id);
                const user = await User.findOne({"recipes": req.params.id})
                const allComments = await Comment.find({'recipe': req.params.id});
                
                // console.log(user)
                // console.log()
                res.render('recipes/show.ejs', {
                    recipeOnTheTemplate: recipeFromTheDatabase,
                    user: user,
                    logged: req.session.logged,
                    commentsOnTheTemplate: allComments,
                    // userOnTheTemplate: user,
                    sessionId: req.session.usersDbId,
                    username: req.session.username
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
        // console.log(req.body)
        const newRecipe = await Recipe.create(req.body);
        // newRecipe.user = req.session.username;
        // const savedRecipe = await newRecipe.save()
        // console.log(req.session.username)
        const foundUser = await User.findOne({'username': req.session.username})
        
        console.log(foundUser)
        foundUser.recipes.push(newRecipe)
        const savedUser = await foundUser.save()
        // console.log(req.session.usersDbId, 'text comment')
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
        const savedComment = await newComment.save();
        const user = await User.findOne({"recipes": req.params.id})
        const foundRecipe = await Recipe.findById(req.params.id);
        foundRecipe.comments.push(newComment._id);
        const savedRecipe = await foundRecipe.save();
        const allComments = await Comment.find({'recipe': req.params.id});
        // console.log(savedComment);
        res.render('recipes/show.ejs', {
            recipeOnTheTemplate: foundRecipe,
            commentsOnTheTemplate: allComments,
            user: user,
            logged: req.session.logged,
            sessionId: req.session.usersDbId,
            username: req.session.username
    })
    }catch(err){
        console.log(err);
        res.send(err);
    } 
})


// //CATEGORY route
// router.get('/category/:type', (req, res) => {
//     console.log(req.params.type);
// })

//EDIT route
router.get('/:id/edit', async (req, res) => {
    try{
        const foundRecipe = await Recipe.findById(req.params.id)
        const foundUser = await User.findOne({'recipes': req.params.id})
        // console.log(foundRecipe);
        res.render('recipes/edit.ejs', {
            recipeOnTheTemplate: foundRecipe,
            userOnTheTemplate: foundUser,
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
    console.log('hit this route');
        const deletedComment = await Comment.findByIdAndDelete(req.params.comment);
        const foundRecipe = await Recipe.findById(req.params.id);
        foundRecipe.comments.remove(req.params.comment);
        const savedRecipe = await foundRecipe.save();
        console.log(savedRecipe);







    // const foundRecipe = await Recipe.findOne({'comments': req.params.id})
    // const deletedComment = await Comment.findByIdAndDelete(req.params.id)
    // console.log(foundRecipe);
    // console.log(foundRecipe.comments);
    // foundRecipe.comments.remove(req.params.comment);
    // const savedRecipe = await foundRecipe.save();
    // console.log(savedRecipe);
    const user = await User.findOne({"recipes": req.params.id})
    // // const foundRecipe = await Recipe.findById(req.params.id);
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