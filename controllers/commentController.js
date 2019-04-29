// const express = require('express');
//  const router = express.Router();
//  const Recipe = require('../models/Recipe');
//  const User = require('../models/User');
//  const Comment = require('../models/Comment');


// router.post('/:id', async (req, res) => {
// const newComment = await Comment.create(req.body);
// const foundRecipe = await Recipe.findOne({'._id': req.params.id});
// foundRecipe.comments.push(newComment._id);
// const allComments = await Comment.find({'recipe': req.params.id});
// res.render('recipes/show.ejs', {
//     recipeOnTheTemplate: recipeFromTheDatabase,
//     commentsOnTheTemplate: allComments,
//     user: user,
//     logged: req.session.logged,
//     sessionId: req.session.usersDbId,
//     username: req.session.username
// })
// })
















//  module.exports = router;