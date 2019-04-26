 const express = require('express');
 const router = express.Router();
 const Recipe = require('../models/Recipe');
 const User = require('../models/User');
 
 //INDEX route:

router.get('/',  (req, res) => {
    Recipe.find({},(err, recipesOnTheDatabase) => {
        if(err){
            console.log(err);
            res.send(err);
        } else {
            console.log(recipesOnTheDatabase[0].user)
            
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
     
    const categories = ['Breakfast', 'Lunch', 'Snacks', 'Dinner', 'Drinks'];
    res.render('recipes/new.ejs', {
        logged: req.session.logged,
        username: req.session.username,
        categories: categories
     });
 })

//SHOW route:
 router.get('/:id', async (req, res) => {
     console.log(req.session)
     try {
               const recipeFromTheDatabase = await Recipe.findById(req.params.id);
                const user = await User.findOne({"recipes": req.params.id})
                
                console.log(user)
                console.log()
                res.render('recipes/show.ejs', {
                    recipeOnTheTemplate: recipeFromTheDatabase,
                    user: user,
                    logged: req.session.logged,
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
        console.log(req.body)
        const newRecipe = await Recipe.create(req.body);
        // newRecipe.user = req.session.username;
        // const savedRecipe = await newRecipe.save()
        console.log(req.session.username)
        const foundUser = await User.findOne({'username': req.session.username})
        
        console.log(foundUser)
        foundUser.recipes.push(newRecipe)
        const savedUser = await foundUser.save()
        console.log(req.session.usersDbId, 'text comment')
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



 module.exports = router;