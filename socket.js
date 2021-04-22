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
            let vievID, editID;
            if(roomsData[socket.roomId] && roomsData[socket.roomId].viewers){
                vievID = roomsData[socket.roomId].viewers.includes(socket.id) ? roomsData[socket.roomId].viewers.indexOf(socket.id) : undefined;
                if(vievID)
                    roomsData[socket.roomId].viewers.splice(vievID, 1);
            }
            if(roomsData[socket.roomId] && roomsData[socket.roomId].editors){
                editID = roomsData[socket.roomId].editors.includes(socket.id) ? roomsData[socket.roomId].editors.indexOf(socket.id) : undefined;
                if(editID)
                    roomsData[socket.roomId].editors.splice(editID, 1);
            } 
        })
    
        socket.on('joinBoardGroup', (roomId, name, lastName, userId, groupOwner)=>{
            socket.join(roomId);
            socket.room = roomId;
            socket.name = name;
            socket.lastName = lastName;
            socket.userId = userId;
            if(roomsData[roomId]){

                if(socket.userId === groupOwner){
                    roomsData[roomId].editors.push({id: socket.id, name: socket.name, lastName: socket.lastName});
                    socket.emit('joinedEditors');
                }else{
                    roomsData[roomId].viewers.push({id: socket.id, name: socket.name, lastName: socket.lastName});
                    socket.emit('joinedViewres');
                }
                
                Lesson.findOne({_id: socket.room}, function(err, lesson){
                    if(err)
                        console.log(err)
                    if(socket.userId === groupOwner)
                        socket.emit('sendCanvasToEditors', lesson.canvasContent);
                    else
                        socket.emit('sendCanvasToViewers', lesson.canvasContent);
                })
            }else{
                roomsData[roomId] = {};
                roomsData[roomId].editors = [];
                roomsData[roomId].viewers = [];

                if(socket.userId === groupOwner){
                    roomsData[roomId].editors.push({id: socket.id, name: socket.name, lastName: socket.lastName});
                    socket.emit('joinedEditors');
                }else{
                    roomsData[roomId].viewers.push({id: socket.id, name: socket.name, lastName: socket.lastName});
                    socket.emit('joinedViewres');
                }

                Lesson.findOne({_id: socket.room}, function(err, lesson){
                    if(err)
                        console.log(err)
                    if(socket.userId === groupOwner)
                        socket.emit('sendCanvasToEditors', lesson.canvasContent);
                    else
                        socket.emit('sendCanvasToViewers', lesson.canvasContent);
                })
            }
            socket.emit('connectedUsers', JSON.stringify(roomsData[roomId].editors), JSON.stringify(roomsData[roomId].viewers));
        })
    
        socket.on('sendMessage', (payload)=>{
            socket.to(socket.room).emit('sendMessage', payload, socket.name, socket.lastName);
            socket.emit('sendMessage', payload, socket.name, socket.lastName);
            
            Lesson.findOne({_id: socket.room}, function(err, lesson){
                if(err)
                    console.log(err);
                const message = new Message({content: payload, ownerId: socket.userId});
                lesson.messages.push(message);
                lesson.save();
                message.save();
            });
            
        })
    
        socket.on('sendCanvas', (canvasDataURI)=>{
            let editors = roomsData[socket.room].editors;
            for(let i = 0; i < editors.length; i++){
                if(editors[i] !== socket.id)
                    io.to(editors[i]).emit('sendCanvasToEditors', canvasDataURI);
            }
    
            let viewer = roomsData[socket.room].viewers;
            for(let i = 0; i < viewer.length; i++){
                io.to(viewer[i]).emit('sendCanvasToViewers', canvasDataURI);
            }
    
            Lesson.updateOne({_id: socket.room}, {canvasContent: canvasDataURI}, function(err, doc){
                if(err)
                    console.log(err);
            })
        })
    });
}