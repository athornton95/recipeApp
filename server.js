const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
require('./db/db');
const port = 3000;

const userController = require('./controllers/userController');
const recipeController = require('./controllers/recipeController');
const authController = require('./controllers/authController');
// const commentController = require('./controllers/commentController');

app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));
const store = new MongoDBStore({
    uri: 'mongodb://localhost/savrApp',
    collection: 'mySessions'
  });

store.on('error', function(error) {
    console.log(error);
});
app.use(session({
    secret: 'stop what you are doing and listen to me',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week
    },
    store: store
}))

app.use('/auth', authController);
app.use('/users', userController);
app.use('/recipes', recipeController);
// app.use('/recipes', commentController);

app.use(express.static('public'));

app.listen(port, () => {
    console.log(`app is listening on port: ${port}`);
});
