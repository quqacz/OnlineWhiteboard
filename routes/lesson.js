const express = require('express');
const router = express.Router();
const users = require('../users');
const Lesson = require('../models/lesson');
const Group = require('../models/group');
const {isLoggedIn} = require('../middleware');

router.get('/add', isLoggedIn, (req,res)=>{
    res.render('newLesson', {groupId: req.params.id});
})

module.exports = router;