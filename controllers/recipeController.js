 const express = require('express');
 const router = express.Router();
 const Recipe = require('../models/Recipe');
 const User = require('../models/User');
 
 
 router.get('/', (req, res) => {
     Recipe.find({}, (err, recipesOnTheDatabase) => {
         if(err){
             console.log(err);
             res.send(err);
         } else {
             res.render('recipes/index.ejs', {
                recipesOnTheTemplate: recipesOnTheDatabase
             })
         }
     })
 })
 
 router.get('/new', (req, res) => {
     res.render('recipes/new.ejs', {
     });
 })


 router.get('/:id', async (req, res) => {
     try {

               const recipeFromTheDatabase = await Recipe.findById(req.params.id);
                const user = await User.findOne({"recipes": req.params.id})
                res.render('recipes/show.ejs', {
                    recipeOnTheTemplate: recipeFromTheDatabase,
                    user: user
                })
        





        //  const recipeOwner = await User.findById(req.params.id);
        //  const recipeId = await Recipe.findOne({
        //      _id: {
        //          $in: recipeOwner.recipes 
        //      }
        //  })
        //  const thisRecipe = await Recipe.findById(recipeId);
        //  res.render('recipes/show.ejs', {
        //      user: recipeOwner,
        //      recipe: thisRecipe.title
        //  })
        // const recipeOnTheTemplate = await Recipe.findById(req.params.id);
        // const recipeOwner = await User.findOne({
        //     _id: {
        //         $in: recipeOwner.recipes
        //     }
        // })
        // res.render('recipes/show.ejs', {

        // });
     } catch(err){
         console.log(err);
         res.send(err);
     }
 })

 router.post('/', async (req, res) => {
    try{
       const newRecipe = await Recipe.create(req.body);
       const userFound = await User.findById(req.session.usersDbId);
       userFound.recipes.push(newRecipe._id);
       const savedUser = await userFound.save();
       res.redirect('/recipes')
    }catch(err){
        console.log(err);
        res.send(err);
    }
})


 









 module.exports = router;