const express = require('express');
const router = express.Router();
const {isLoggedIn, isGroupOwner, isInTheGroup} = require('../middleware');
const Group = require('../models/group');
const User = require('../models/user');
const Lesson = require('../models/lesson');
const mutler = require('multer');
const { storage, cloudinary } = require('../cloudinary');
const upload = mutler({ storage });
const sh = require('shorthash');


router.post('/add', isLoggedIn, upload.single('groupPic'), async(req,res)=>{
    try{
        const {groupName, description} = req.body;
        const entryCode = sh.unique(groupName+description+""+Math.random()+""+Math.random());

        const newGroup = new Group({ groupName, description, entryCode, owner: req.user._id, 
            imageUrl: req.file ? req.file.path : 'https://wiki.dave.eu/images/4/47/Placeholder.png', 
            imageFileName: req.file ? req.file.filename : ''})

        const group = await newGroup.save();
		req.flash('success', 'Pomyślnie utworzono nową grupę')
        res.redirect('/group/'+group._id);

    }
    catch(e){
        console.log(e);
		req.flash('error', 'Nie udało się utworzyć nowej grupy')
        res.redirect('/user/'+req.user._id);
    }
})

router.get('/:id', isLoggedIn, isInTheGroup, async(req, res)=>{
	try{
        const group = await Group.findOne({_id: req.params.id}).populate('lessons').populate('students').populate('owner');
        res.render('group', {groupData: group})
    }catch(e){
        console.log(e);
        res.redirect('/');
    }
})

router.get('/:id/lesson/:lessonId', isLoggedIn, isInTheGroup, async(req, res)=>{
    const messages = await Lesson.findOne({_id: req.params.lessonId})
        .populate({
            path: 'messages', 
            populate: {
                path: 'ownerId'
            }
        });
    const groupOwner = await Group.findOne({_id: req.params.id}).populate('owner');
	res.render('board', {groupId: req.params.lessonId, owner: groupOwner.owner._id, messages: messages.messages})
})

router.post('/:id/lesson/add', isLoggedIn, isGroupOwner, async(req, res)=>{
    try{
        const { topic } = req.body;
        const newLesson = new Lesson({
            topic
        })
        const lesson = await newLesson.save();
        const group = await Group.findOne({_id: req.params.id});
        group.lessons.push(newLesson);
        const updatetGroup = await group.save();
	    req.flash('success', 'Pomyślnie dodano nową lekcję') 
        res.redirect('/group/'+req.params.id);
    }catch (e){
        console.log(e);
	    req.flash('error', 'Wystąpił błąd przy tworzeniu lekcji')
        res.redirect('/group/'+req.params.id);
    }
})

router.delete('/:id/user/:userId', isLoggedIn, isGroupOwner, async(req, res)=>{
    try{
        const group = await Group.findOne({_id: req.params.id});
        const user = await User.findOne({_id: req.params.userId});
        group.students.pull({_id: req.params.userId});
        user.groups.pull({_id: req.params.id});
        group.save();
        user.save();
		req.flash('success', 'Użytkownik został usunięty pomyślnie') 
        res.redirect('/group/'+req.params.id);
    }catch(e){
        console.log(e);
	    req.flash('error', 'Wystąpił błąd przy usuwaniu użytkownika')
        res.redirect('/group/'+req.params.id);
    }
})

router.put('/:id/update/avatar', isLoggedIn, isGroupOwner, upload.single('newGroupPic'), async(req, res)=>{
    try{
        const group = await Group.findOne({_id: req.params.id});
        if(req.file){
            if(group.imageFileName)
                await cloudinary.uploader.destroy(group.imageFileName);
            group.imageUrl = req.file.path;
            group.imageFileName = req.file.filename;
            await group.save();
            req.flash('success', 'Zmieniono awatar grupy');
        }else{
            req.flash('error', 'Nie przesłano pliku');
        }
        
    }catch(e){
        console.log(e);
        req.flash('error', 'Błąd przy zmianie awatara');
    }
    res.redirect('/group/'+req.params.id);
})

router.put('/:id/update/groupName', isLoggedIn, isGroupOwner, async(req, res)=>{
    try{
        const group = await Group.findOne({_id: req.params.id});
        group.groupName = req.body.newGroupName;
        await group.save();
        req.flash('success', 'Zmieniono nazwę grupy');
    }catch(e){
        console.log(e);
        req.flash('error', 'Błąd przy zmianie nazwy grupy');
    }
    res.redirect('/group/'+req.params.id);
})

router.put('/:id/update/description', isLoggedIn, isGroupOwner, async(req, res)=>{
    try{
        const group = await Group.findOne({_id: req.params.id});
        group.description = req.body.newGroupDescription;
        await group.save();
        req.flash('success', 'Zmieniono opis grupy');
    }catch(e){
        console.log(e);
        req.flash('error', 'Błąd przy zmianie opisu grupy');
    }
    res.redirect('/group/'+req.params.id);
})
module.exports = router;