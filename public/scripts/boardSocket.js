const socket = io();

socket.name = userName;
socket.lastName = userLastName;

socket.emit('joinBoardGroup', groupId, socket.name, socket.lastName);

socket.on('sendMessage', (payload, name, lastName)=>{
    const sendMessage = document.createElement('div');
    const sender = document.createElement('p');
    const message = document.createElement('p');
    const hr = document.createElement('hr');

    sender.textContent = `${name} ${lastName}`;
    message.textContent = payload;

    sendMessage.appendChild(sender);
    sendMessage.appendChild(message);
    sendMessage.appendChild(hr);

    chatBoxMessages.appendChild(sendMessage);
})


function sendMessage(){
    const payload = textMessageContent.value;
    socket.emit('sendMessage', payload);
}