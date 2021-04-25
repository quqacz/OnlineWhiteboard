const express = require('express');
const router = express.Router();
const {isLoggedIn} = require('../middleware');
const Group = require('../models/group');
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

router.get('/:id', isLoggedIn, async(req, res)=>{
	try{
        let dummyUsers = [];
    
        for(let i = 0; i < 15; i ++){
            dummyUsers.push(users[Math.floor(Math.random()*users.length)]);
        }
        const group = await Group.findOne({_id: req.params.id}).populate('lessons');
        res.render('group', {groupData: group, users: dummyUsers})
    }catch(e){
        console.log(e);
        res.redirect('/');
    }
})

router.delete('/:id/delete', isLoggedIn, (req, res)=>{
    res.send('strona do usuwania usera z grupy')
})

router.get('/:id/lesson/:lessonId', isLoggedIn, async(req, res)=>{
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

router.post('/:id/lesson/add', isLoggedIn, async(req, res)=>{
    try{
        const { topic } = req.body;
        const newLesson = new Lesson({
            topic
        })
        newLesson.save();
        const group = await Group.findOne({_id: req.params.id});
        group.lessons.push(newLesson);
        const updatedGroup = await group.save();
        res.redirect('/group/'+req.params.id);
    }catch (e){
        console.log(e)
        res.redirect('/group/'+req.params.id);
    }
})

module.exports = router;