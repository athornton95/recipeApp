 const express = require('express');
 const router = express.Router();
 const Recipe = require('../models/Recipe');
 const User = require('../models/User');
 
 //INDEX route:
 router.get('/', (req, res) => {
     Recipe.find({}, (err, recipesOnTheDatabase) => {
         if(err){
             console.log(err);
             res.send(err);
         } else {
             res.render('recipes/index.ejs', {
                recipesOnTheTemplate: recipesOnTheDatabase,
                logged: req.session.logged
             })
         }
     })
 })
 
 //NEW route:
 router.get('/new', (req, res) => {
     res.render('recipes/new.ejs', {
     });
 })

//SHOW route:
 router.get('/:id', async (req, res) => {
     console.log(req.session)
     try {
               const recipeFromTheDatabase = await Recipe.findById(req.params.id);
                const user = await User.findOne({"recipes": req.params.id})
                
 
                res.render('recipes/show.ejs', {
                    recipeOnTheTemplate: recipeFromTheDatabase,
                    user: user,
                    logged: req.session.logged,
                    userOnTheTemplate: user,
                    sessionId: req.session.usersDbId
                })
     } catch(err){
         console.log(err);
         res.send(err);
     }
 })

 //CREATE route
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

//EDIT route
router.get('/:id/edit', async (req, res) => {
    try{
        const foundRecipe = await Recipe.findById(req.params.id)
        const foundUser = await User.findOne({'recipes': req.params.id})
        console.log(foundRecipe);
        res.render('recipes/edit.ejs', {
            recipeOnTheTemplate: foundRecipe,
            userOnTheTemplate: foundUser
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



 module.exports = router;