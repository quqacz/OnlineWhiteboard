const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Group = require('../models/group');
const {isLoggedIn} = require('../middleware');
const mutler = require('multer');
const { storage } = require('../cloudinary');
const upload = mutler({ storage });

router.get('/:id', isLoggedIn, async(req, res)=>{
    const user = await User.findOne({_id: req.user._id}).populate('groups');
    const ownedGroups = await Group.find({owner: req.user._id}).populate('students').populate('lessons');
    res.render('user', {user, ownedGroups})
})

router.post('/:id/joinGroup', isLoggedIn, async(req, res)=>{
    try{
        const {entryCode} = req.body;
        const group = await Group.findOne({entryCode: entryCode});
        const student = await User.findOne({_id: req.user._id});
        if(!group.students.includes(req.user._id) && group.owner._id.toString() !== req.user._id.toString()){
            group.students.push(student);
            const updatetGroup = await group.save();
            student.groups.push(group);
            const updatedStudent = await student.save();
			      req.flash('success', 'Pomyślnie dołączono do grupy')
        }
    }catch(e){
        console.log(e);
		    req.flash('error', 'Nie udało się dołączyć do grupy')
    }
    res.redirect('/user/'+req.user._id.toString());
})

router.put('/:id/update/avatar', isLoggedIn, upload.single('newUserPic'), async(req,res)=>{
    try{
        const user = await User.findOne({_id: req.params.id});
        if(req.file){
            user.imageUrl = req.file.path;
            user.imageFileName = req.file.filename;
            await user.save();
            req.flash('success', 'Pomyślnie zmieniono zdjęcie profilowe');
        }else{
            req.flash('error', 'Błąd przesłanego pliku');
        }
    }catch(e){
        console.log(e);
        req.flash('error', 'Błąd przy zmianie zdjęcia profilowego');
    }
    res.redirect('/user/'+req.params.id);
});

router.put('/:id/update/data', isLoggedIn, async(req, res)=>{
    try{
        const user = await User.findOne({_id: req.params.id});
        user.name = req.body.newName;
        user.lastName = req.body.newLastName;
        await user.save();
        req.flash('success', 'Pomyślnie zmieniono dane użytkownika');
    }catch(e){
        console.log(e);
        req.flash('error', 'Błąd przy zmianie danych użytkownika');
    }
    res.redirect('/user/'+req.params.id);
});

router.put('/:id/update/password', isLoggedIn, async(req,res)=>{
    User.findById(req.params.id).then(function(sanitizedUser){
        if (sanitizedUser){
            sanitizedUser.setPassword(req.body.newPassword, function(){
                sanitizedUser.save();
                req.flash('success', 'Pomyślnie zmieniono hasło');
                res.redirect('/user/'+req.params.id);
            });
        } else {
            req.flash('error', 'Błąd zmiany hasła');
            res.redirect('/user/'+req.params.id);
        }
    },function(err){
        console.error(err);
        req.flash('error', 'Błąd zmiany hasła');
        res.redirect('/user/'+req.params.id);
    }) 
})

router.put('/:id/theme/dark', isLoggedIn, async(req, res)=>{
    try{
        const user = await User.findOne({_id: req.params.id});
        if(user.lightTheme){
            user.lightTheme = false;
            await user.save();
            req.flash('success', 'Pomyślnie zmieniono motyw');
        }
    }catch(e){
        console.log(e);
        req.flash('error', 'Błąd zmiany motywu');
    }
    res.redirect('/user/'+req.params.id);
})

router.put('/:id/theme/light', isLoggedIn, async(req, res)=>{
    try{
        const user = await User.findOne({_id: req.params.id});
        if(!user.lightTheme){
            user.lightTheme = true;
            await user.save();
            req.flash('success', 'Pomyślnie zmieniono motyw');
        }
    }catch(e){
        console.log(e);
        req.flash('error', 'Błąd zmiany motywu');
    }
    res.redirect('/user/'+req.params.id);
})
module.exports = router;