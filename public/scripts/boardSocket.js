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


socket.on('sendCanvasToViewers', (dataURI)=>{
    let data = JSON.parse(dataURI);
    let image = new Image();
    image.onload = function () {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height); // draw the new image to the screen
    }
    image.src = data.image; // data.image contains the data URL
})

function sendMessage(){
    const payload = textMessageContent.value;
    socket.emit('sendMessage', payload);
}

function sendCanvasContentToViewers(){
    let canvasContents = canvas.toDataURL(); // a data URL of the current canvas image
    let data = { image: canvasContents, date: Date.now() };
    let string = JSON.stringify(data);
    socket.emit('sendCanvasToViewers', string);
}