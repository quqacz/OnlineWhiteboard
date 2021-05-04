const express = require('express');
const router = express.Router();
const {isLoggedIn, isGroupOwner, isInTheGroup} = require('../middleware');
const Group = require('../models/group');
const User = require('../models/user');
const Lesson = require('../models/lesson');
const users = require('../users');

router.post('/add', isLoggedIn, async(req,res)=>{
    try{
        const {groupName, description} = req.body;
        const entryCode = ~~(Math.random()*10000000000);

        const newGroup = new Group({ groupName, description, entryCode, owner: req.user._id})

        const group = await newGroup.save();
        res.redirect('/group/'+group._id);
    }
    catch(e){
        console.log(e);
        res.redirect('/group/add');
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
        res.redirect('/group/'+req.params.id);
    }catch (e){
        console.log(e);
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
        res.redirect('/group/'+req.params.id);
    }catch(e){
        console.log(e);
        res.redirect('/group/'+req.params.id);
    }
})
module.exports = router;