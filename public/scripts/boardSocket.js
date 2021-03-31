const socket = io();

socket.emit('joinBoardGroup', groupId);

socket.emit('sayHello', "loooool");

socket.on('sayHello', (payload)=>{
    console.log(payload);
})