const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const session = require('express-session');
require('./db/db');
const port = 3000;

const userController = require('./controllers/userController');
const recipeController = require('./controllers/recipeController');
const authController = require('./controllers/authController');

app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(session({
    secret: 'stop what you are doing and listen to me',
    resave: false,
    saveUninitialized: false
}))

app.use('/users', userController);
app.use('/recipes', recipeController);
app.use('/auth', authController);


app.listen(port, () => {
    console.log(`app is listening on port: ${port}`);
});
