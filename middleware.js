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

module.exports.isInTheGroup = async(req, res, next)=>{
    const group = await Group.findOne({_id: req.params.id});
    if(group.owner._id.toString() === req.user._id.toString() || group.students.includes(req.user._id)){
        next();
    }else{
        return res.redirect('/user/'+req.user._id);
    }
}

module.exports.isUser = async(req, res, next)=>{
    if(req.user._id.toString() === req.params.id){
        next();
    }else{
        return res.redirect('/user/'+req.user._id);
    }
}