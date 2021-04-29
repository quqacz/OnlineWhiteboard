const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Group = require('../models/group');
const {isLoggedIn, isNotInTheGroup} = require('../middleware');

router.get('/:id', isLoggedIn, async(req, res)=>{
    const user = await User.findOne({_id: req.user._id}).populate('groups');
    const ownedGroups = await Group.find({owner: req.user._id}).populate('students').populate('lessons');
    res.render('user', {user, ownedGroups})
})

router.post('/:id/joinGroup', isLoggedIn, isNotInTheGroup, async(req, res)=>{
    try{
        const {entryCode} = req.body;
        const group = await Group.findOne({entryCode: entryCode});
        const student = await User.findOne({_id: req.user._id});
        group.students.push(student);
        const updatetGroup = await group.save();
        student.groups.push(group);
        const updatedStudent = await student.save();
        res.redirect('/user/'+student._id);
    }catch(e){
        console.log(e);
        res.redirect('/');
    }
})

module.exports = router;