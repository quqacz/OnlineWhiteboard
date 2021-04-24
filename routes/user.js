const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Group = require('../models/group');
const {isLoggedIn} = require('../middleware');

router.get('/:id', isLoggedIn, async(req, res)=>{
    const user = await User.findOne({_id: req.user._id}).populate('groups');
    const ownedGroups = await Group.find({owner: req.user._id}).populate('students').populate('lessons');
	const groupsBelongedTo = await Group.find({students: req.user._id});
    res.render('user', {user, ownedGroups, groupsBelongedTo})
})

router.post('/:id/joinGroup', isLoggedIn, async(req, res)=>{
    try{
        const {entryCode} = req.body;
        const group = await Group.findOne({entryCode: entryCode});
        const student = await User.findOne({_id: req.user._id});
        group.students.push(student);
        group.save();
        student.groups.push(group);
        student.save();
        res.redirect('/user/'+req.user._id);
    }catch(e){
        console.log(e);
        res.redirect('/user/'+req.user._id);
    }
})

module.exports = router;