const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');



router.get('/login', (req, res) => {
  console.log(req.session)
    res.render('login.ejs', {
        message: req.session.message,
        logged: req.session.logged
    })
});

router.post('/register', async (req, res) => {
  const password = req.body.password;
  const passwordHash = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
  const userDbEntry = {};
  userDbEntry.username = req.body.username;
  userDbEntry.password = passwordHash;
  try {
      const foundUsers = await User.find({});
      
      foundUsers.forEach((user) => {
        if(userDbEntry.username === user.username){
          req.session.message = "User name not available";
          res.render('login.ejs', {
            message: req.session.message,
            logged: req.session.logged
          })
      }
      })

      const createdUser = await User.create(userDbEntry);
      req.session.logged = true;
      req.session.usersDbId = createdUser._id;
      req.session.username = createdUser.username;
      console.log(createdUser);
      res.redirect('/recipes');
  } catch(err){
      console.log(err)
      res.send(err)
  } 
});
  
  router.post('/login', async (req, res) => {
    try{
      console.log(req.session)
      const foundUser = await User.findOne({'username': req.body.username});
      if(foundUser){
        if(bcrypt.compareSync(req.body.password, foundUser.password)){
          req.session.logged = true;
          req.session.usersDbId = foundUser._id;
          req.session.username = foundUser.username;
          console.log(req.session, 'successful login!')
          res.redirect('/recipes')
        } else {
          req.session.message = 'username or password is incorrect';
          res.redirect('/auth/login')
        }
      } else {
        req.session.message = 'username or password is incorrect';
        res.redirect('/auth/login');
      }
    }catch(err){
      res.send(err)
    }
  });
  

  router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
      if(err){
        res.send(err);
      } else {
        res.redirect('/auth/login');
      }
    })
  })




module.exports = router;