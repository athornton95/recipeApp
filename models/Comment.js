const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    body: {type: String, maxlength: 140},
    user: {type: mongoose.Schema.Types.ObjectId,
    ref: 'User'},
    recipe: {type: mongoose.Schema.Types.ObjectId,
    ref: 'Recipe'}
})

module.exports = mongoose.model('Comment', commentSchema);