const express = require('express');
const router = express.Router();
const {isLoggedIn} = require('../middleware');
const Group = require('../models/group');
const users = require('../users');

router.get('/add', isLoggedIn, (req,res)=>{
    res.render('newGroup');
})

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

module.exports = router;