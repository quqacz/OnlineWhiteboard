const Group = require('./models/group');

module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()){
        req.session.returnTo = req.originalUrl;
        return res.redirect('/login');
    }
    next();
}

module.exports.isGroupOwner = async(req, res, next) =>{
    const group = await Group.findOne({_id: req.params.id}).populate('owner');
    if(group.owner._id.toString() == req.user._id.toString()){
        next();
    }else{
        return res.redirect('/group/'+req.params.id);
    }
}

module.exports.isNotInTheGroup = async(req, res, next)=>{
    const {entryCode} = req.body;
    const group = await Group.findOne({entryCode: entryCode});
    if(group.owner._id.toString() !== req.user._id.toString() && !group.students.includes(req.user._id)){
        next();
    }else{
        return res.redirect('/group/'+group._id);
    }
    next();
}

module.exports.isInTheGroup = async(req, res, next)=>{
    const group = await Group.findOne({_id: req.params.id}).populate('owner');
    if(group.owner._id.toString() === req.user._id.toString() || group.students.includes(req.user._id)){
        next();
    }else{
        return res.redirect('/user/'+req.user._id);
    }
}