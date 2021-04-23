const socket = io();

socket.name = userName;
socket.lastName = userLastName;
socket._id = currentUserId;
socket.groupId = groupId;
socket.emit('joinBoardGroup', socket.groupId, socket.name, socket.lastName, socket._id, groupOwner);

socket.on('connectedUsers', (connectedUsers)=>{
    const editors = JSON.parse(connectedUsers).editors;
    const viewers = JSON.parse(connectedUsers).viewers;
    console.log(editors);
    for(let i = 0; i < editors.length; i++){
        const userFrame = document.createElement('div');
        const userData = document.createElement('span');

        userData.textContent = `${editors[i].name} ${editors[i].lastName}`;
        userFrame.appendChild(userData);
        if(socket._id === groupOwner && socket._id !== editors.userId){
            const removeButton = document.createElement('button');
            removeButton.innerHTML = "Usuń z lekcji";
            removeButton.addEventListener('click', ()=>{
                socket.emit('forceRemove', editors[i].userId);
            })
            userFrame.appendChild(removeButton);
        }
        boardUsers.appendChild(userFrame);
    }
    boardUsers.appendChild(document.createElement('hr'));

    for(let i = 0; i < viewers.legth; i ++){
        console.log('viwer table');
        const userFrame = document.createElement('div');
        const userData = document.createElement('span');

        userData.textContent = `${viewers[i].name} ${viewers[i].lastName}`;
        userFrame.appendChild(userData);
        if(socket._id === groupOwner){
            const removeButton = document.createElement('button');
            removeButton.innerHTML = "Usuń z lekcji";
            removeButton.addEventListener('click', ()=>{
                socket.emit('forceRemove', viewers[i].id);
            })
            userFrame.appendChild(removeButton);

            const giveDrawingPermition = document.createElement('button');
            giveDrawingPermition.innerHTML = 'Daj rysować';
            giveDrawingPermition.addEventListener('click', ()=>{
                socket.emit('givePermition', viewers[i].id);
            })
            userFrame.appendChild(giveDrawingPermition);
        }
        boardUsers.appendChild(userFrame);
    }
})

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
        canvasContent.lines = content.lines;
        canvasContent.shapes = content.shapes;
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
    let controls = document.querySelectorAll('.drawingControls');
    for(let i = 0; i < controls.length; i++){
        controls[i].classList.add('biedaHidden');
    }
})

socket.on('joinedEditors', ()=>{
    isViewer = false;
    let controls = document.querySelectorAll('drawingControls');
    for(let i = 0; i < controls.length; i++){
        controls[i].classList.remove('biedaHidden');
    }
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