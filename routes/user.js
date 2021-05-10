const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Group = require('../models/group');
const {isLoggedIn} = require('../middleware');

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

module.exports = router;