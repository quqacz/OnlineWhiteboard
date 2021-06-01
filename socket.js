const Lesson = require('./models/lesson')
const Message = require('./models/message');
const roomsData = {};

exports = module.exports = function(io){
    io.on('connection', (socket) => {
        console.log("user connected");
    
        socket.on('disconnect', () => {
            console.log("disconnect");
        });
    
        socket.on('disconnecting', ()=>{
            if(roomsData[socket.room] && roomsData[socket.room].viewers)
                delete roomsData[socket.room].viewers[socket.id];
            if(roomsData[socket.room] && roomsData[socket.room].editors)
                delete roomsData[socket.room].editors[socket.id];
            const usersData = {
                editors: roomsData[socket.room] ? (roomsData[socket.room].editors ? roomsData[socket.room].editors : '') : '',
                viewers: roomsData[socket.room] ? (roomsData[socket.room].viewers ? roomsData[socket.room].viewers : '') : ''
            }
            socket.to(socket.room).emit('connectedUsers', JSON.stringify(usersData));
            socket.emit('connectedUsers', JSON.stringify(usersData));
        })
    
        socket.on('joinBoardGroup', (roomId, name, lastName, userId, groupOwner, profilePic)=>{
            socket.join(roomId);
            socket.room = roomId; // :lessonId
            socket.name = name; //User.name
            socket.lastName = lastName; // User.lastName
            socket.userId = userId; // User._id
            socket.profilePic = profilePic; 
            if(roomsData[roomId]){
                try{
                    Lesson.findOne({_id: socket.room}, function(err, lesson){
                        if(err){
                            console.log(err);
                        }
                        socket.emit('sendCanvas', lesson.canvasContent);

                    })
                }catch(e){
                    console.log(e);
                    socket.emit('sendCanvas', "");
                }
            }else{
                roomsData[roomId] = {};
                roomsData[roomId].editors = {};
                roomsData[roomId].viewers = {};
                try{
                    Lesson.findOne({_id: socket.room}, function(err, lesson){
                        if(err){
                            console.log(err);
                        }
                        socket.emit('sendCanvas', lesson.canvasContent);
                    })
                }catch(e){
                    console.log(e);
                    socket.emit('sendCanvas', "");
                }
            }

            if(socket.userId === groupOwner){
                roomsData[roomId].editors[socket.id] = {name: socket.name, lastName: socket.lastName, profilePic: socket.profilePic};
                socket.emit('joinedEditors');
            }else{
                roomsData[roomId].viewers[socket.id] = {name: socket.name, lastName: socket.lastName, profilePic: socket.profilePic};
                socket.emit('joinedViewres');
            }
            const usersData = {
                editors: roomsData[roomId].editors,
                viewers: roomsData[roomId].viewers
            }
            socket.to(socket.room).emit('connectedUsers', JSON.stringify(usersData));
            socket.emit('connectedUsers', JSON.stringify(usersData));
        })
    
        socket.on('sendMessage', (payload)=>{
            socket.to(socket.room).emit('sendMessage', payload, socket.name, socket.lastName, socket.profilePic);
            socket.emit('sendMessage', payload, socket.name, socket.lastName, socket.profilePic);
            
            try{
                Lesson.findOne({_id: socket.room}, function(err, lesson){
                    if(err){
                        console.log(err);
                    }else{
                        const message = new Message({content: payload, ownerId: socket.userId});
                        lesson.messages.push(message);
                        lesson.save();
                        message.save();
                    }
                });
            }catch(e){
                console.log(e);
            }
            
        })
    
        socket.on('sendCanvas', (canvasDataURI)=>{
            let editors = Object.keys(roomsData[socket.room].editors);
            for(let i = 0; i < editors.length; i++){
                if(editors[i] !== socket.id)
                    io.to(editors[i]).emit('sendCanvas', canvasDataURI);
            }
    
            let viewer = Object.keys(roomsData[socket.room].viewers);
            for(let i = 0; i < viewer.length; i++){
                io.to(viewer[i]).emit('sendCanvas', canvasDataURI);
            }
            
            try{
                Lesson.updateOne({_id: socket.room}, {canvasContent: canvasDataURI}, function(err, doc){
                if(err)
                    console.log(err);
                })
            }catch(e){
                console.log(e);
            }
        })

        socket.on('giveDrawingPer', (id, name, lastName)=>{
            roomsData[socket.room].editors[id] = {name: name, lastName: lastName};
            delete roomsData[socket.room].viewers[id];
            io.to(id).emit('joinedEditors');

            const usersData = {
                editors: roomsData[socket.room].editors,
                viewers: roomsData[socket.room].viewers
            }
            socket.to(socket.room).emit('connectedUsers', JSON.stringify(usersData));
            socket.emit('connectedUsers', JSON.stringify(usersData));

        })

        socket.on('removeDrawingPer', (id, name, lastName)=>{
            roomsData[socket.room].viewers[id] = {name: name, lastName: lastName};
            delete roomsData[socket.room].editors[id];
            io.to(id).emit('joinedViewres');
            const usersData = {
                editors: roomsData[socket.room].editors,
                viewers: roomsData[socket.room].viewers
            }
            socket.to(socket.room).emit('connectedUsers', JSON.stringify(usersData));
            socket.emit('connectedUsers', JSON.stringify(usersData));
        })

        socket.on('forceRemove', (id)=>{
            io.to(id).emit('forceRemove');
        })
        
        socket.on('requestCanvasContent', (id)=>{
            Lesson.findOne({_id: id}, (err, lesson)=>{
                if(err){
                    console.log(err);
                }else{
                    socket.emit('getCanvasContent', lesson.canvasContent);
                }
            })
        })

    });
}