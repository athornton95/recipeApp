const mongoose = require('mongoose');


const recipeSchema = new mongoose.Schema({
    title: {type: String, required: true},
    img: {type: String, default: 'https://aucdn.ar-cdn.com/recipes/xlarge/default.jpg'},
    body: {type: String, required: true},
    user: {type: String, required: true},
    category: String,
    ingredients: String,
    comments: [{type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'}]
})





module.exports = mongoose.model('Recipe', recipeSchema);