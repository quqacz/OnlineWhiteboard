const express = require('express');
const router = express.Router();
const User = require('../models/user');
const passport = require('passport');
const mutler = require('multer');
const { storage } = require('../cloudinary');
const upload = mutler({ storage });

router.get('/', (req,res)=>{
    res.render("mainPage");
})

router.get('/login', (req, res)=>{
	res.render("login");
})

router.post('/login', passport.authenticate('local', {failureRedirect: '/login', failureFlash: 'Błędny login lub hasło'}), (req, res)=>{
    req.flash('success', 'Pomyślnie zalogowano')
    res.redirect(req.session.returnTo ? req.session.returnTo : '/user/'+req.user._id);
})

router.get('/register', (req, res)=>{
	 res.render("register");
})

router.post('/register', upload.single('profilePic'), async(req, res)=>{
    try{
        const {name, lastName, username, password} = req.body;
        const user = new User({ name, lastName, username,
            imageUrl: req.file ? req.file.path : 'https://wiki.dave.eu/images/4/47/Placeholder.png', 
            imageFileName: req.file ? req.file.filename : ''});
        const regUser = await User.register(user, password);
        req.login(regUser, err=>{
            if(err){
                req.flash('error', 'Błąd rejestracji użytkownika')
                res.redirect('/register')
            }
            else{
                req.flash('success', `Pomyślnie zarejestrowano`)
                res.redirect('/user/'+regUser._id);
            }
        });
    }catch (e){
        console.log(e);
        if(e.name ==='UserExistsError'){
            req.flash('error', 'Użytkownik o podanym loginie już istnieje');
        }else{
            req.flash('error', 'Błąd rejestracji użytkownika');
        }
        res.redirect('/register');
    }
})
router.get('/logout', (req,res)=>{
    req.logOut();
	req.flash('success', 'Wylogowanie przebiegło pomyślnie');
    res.redirect('/');
})

module.exports = router;