const express = require('express');
const router = express.Router();
const User = require('../models/user');
const passport = require('passport');

router.get('/', (req,res)=>{
    res.render("mainPage");
})

router.get('/login', (req, res)=>{
	res.render("login");
})

router.post('/login', passport.authenticate('local', {failureRedirect: '/login'}), (req, res)=>{
    res.redirect(req.session.returnTo ? req.session.returnTo : '/user/'+req.user._id);
})

router.get('/register', (req, res)=>{
	 res.render("register");
})

router.post('/register', async(req, res)=>{
    try{
        const {name, lastName, username, password} = req.body;
        const user = new User({ name, lastName, username});
        const regUser = await User.register(user, password);
        req.login(regUser, err=>{
            if(err)
                res.redirect('/register')
            else
                res.redirect('/user/'+regUser._id);
        });
    }catch (e){
        console.log(e);
        res.redirect('/register');
    }
})

router.get('/logout', (req,res)=>{
    req.logOut();
    res.redirect('/');
})

module.exports = router;