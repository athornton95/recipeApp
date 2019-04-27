const mongoose = require('mongoose');


const recipeSchema = new mongoose.Schema({
    title: {type: String, required: true},
    img: {type: String, default: 'https://aucdn.ar-cdn.com/recipes/xlarge/default.jpg'},
    body: {type: String, required: true},
    user: {type: String, required: true},
    category: String,
    ingredients: String
})





module.exports = mongoose.model('Recipe', recipeSchema);