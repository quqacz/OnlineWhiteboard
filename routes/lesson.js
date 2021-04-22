const express = require('express');
const router = express.Router();
const users = require('../users');
const Lesson = require('../models/lesson');
const Group = require('../models/group');
const {isLoggedIn} = require('../middleware');

router.get('/add', isLoggedIn, (req,res)=>{
    res.render('newLesson', {groupId: req.params.id});
})

router.post('/add', isLoggedIn, async(req, res)=>{
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