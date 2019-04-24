const mongoose = require('mongoose');
const Recipe = require('./Recipe');

const userSchema = new mongoose.Schema({
    username: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    recipes: [{type: mongoose.Schema.Types.ObjectId,
                ref: 'Recipe'
            }]
})


module.exports = mongoose.model('User', userSchema);