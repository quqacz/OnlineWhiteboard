const socket = io();

socket.name = userName;
socket.lastName = userLastName;
socket._id = currentUserId;
socket.groupId = groupId;
socket.emit('joinBoardGroup', socket.groupId, socket.name, socket.lastName, socket._id);

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


socket.on('sendCanvasToViewers', (jsonObject)=>{
    let content ='';
    if(jsonObject.length !== 0){
        content = JSON.parse(jsonObject);
        renderPoints(content.lines);
    }
})

socket.on('sendCanvasToEditors', (jsonObject)=>{
    let content ='';
    if(jsonObject.length !== 0){
        content = JSON.parse(jsonObject);
        canvasContent.lines = content.lines;
        canvasContent.shapes = content.shapes;
        renderPoints(content.lines);
    }
})

socket.on('joinedViewres', ()=>{
    isViewer = true;
})

socket.on('joinedEditors', ()=>{
    isViewer = false;
})

function sendMessage(){
    const payload = textMessageContent.value;
    socket.emit('sendMessage', payload);
}

function sendCanvasContent(){
    let canvasShapes = JSON.stringify(canvasContent);
    socket.emit('sendCanvas', canvasShapes);
}

function drawFromBase64(URI){
    if(URI.length === 0) return;
    
    let data = JSON.parse(URI);
    let image = new Image();
    image.onload = function () {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    }
    image.src = data.image;
}