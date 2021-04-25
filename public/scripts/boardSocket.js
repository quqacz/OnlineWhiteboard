const socket = io();

socket.name = userName;
socket.lastName = userLastName;
socket._id = currentUserId;
socket.groupId = groupId;
socket.emit('joinBoardGroup', socket.groupId, socket.name, socket.lastName, socket._id, groupOwner);
let viewers;
let viewresKeys;
let editors;
let editorsKeys;
socket.on('connectedUsers', (connectedUsers)=>{
    const Editors = JSON.parse(connectedUsers).editors;
    const Viewers = JSON.parse(connectedUsers).viewers;

    editors = Object.values(Editors);
    editorsKeys = Object.keys(Editors);

    viewers = Object.values(Viewers);
    viewersKeys = Object.keys(Viewers);

    fillActiveUserData();
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
        canvasContent.Lines = content.Lines;
        canvasContent.rects = content.rects;
        canvasContent.ellipses = content.ellipses;
        canvasContent.tmpLine = content.tmpLine;
        canvasContent.tmpRect = content.tmpRect;
        canvasContent.tmpEllipse = content.tmpEllipse;
        redrawCanvas(content);
    }
})

socket.on('sendCanvasToEditors', (jsonObject)=>{
    let content ='';
    if(jsonObject.length !== 0){
        content = JSON.parse(jsonObject);
        canvasContent.lines = content.lines;
        canvasContent.Lines = content.Lines;
        canvasContent.rects = content.rects;
        canvasContent.ellipses = content.ellipses;
        canvasContent.tmpLine = content.tmpLine;
        canvasContent.tmpRect = content.tmpRect;
        canvasContent.tmpEllipse = content.tmpEllipse;
        redrawCanvas(content);
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
    let controls = document.querySelectorAll('.drawingControls');
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

function fillActiveUserData(){
    boardUsers.innerHTML = '';
    fillEditorsData();
    fillViewersData();
}

function fillEditorsData(){
    for(let i = 0; i < editors.length; i++){
        const userFrame = document.createElement('div');
        const userData = document.createElement('span');

        userData.textContent = `${editors[i].name} ${editors[i].lastName}`;
        userFrame.appendChild(userData);

        if(socket._id === groupOwner && socket.id !== editorsKeys[i]){
            const removeButton = document.createElement('button');
            removeButton.innerHTML = "Usuń z lekcji";
            removeButton.addEventListener('click', ()=>{
                socket.emit('forceRemove', editorsKeys[i]);
            })
            userFrame.appendChild(removeButton);

            const drawingPer = document.createElement('button');
            drawingPer.innerHTML = "Zabierz uprawnienia";
            drawingPer.addEventListener('click', ()=>{
                socket.emit('removeDrawingPer', editorsKeys[i], editors[i].name, editors[i].lastName);
            })
            userFrame.appendChild(drawingPer);
        }
        boardUsers.appendChild(userFrame);
    }
    boardUsers.appendChild(document.createElement('hr'));
}

function fillViewersData(){
    for(let i = 0; i < viewers.length; i++){
        const userFrame = document.createElement('div');
        const userData = document.createElement('span');

        userData.textContent = `${viewers[i].name} ${viewers[i].lastName}`;
        userFrame.appendChild(userData);

        if(socket._id === groupOwner){
            const removeButton = document.createElement('button');
            removeButton.innerHTML = "Usuń z lekcji";
            removeButton.addEventListener('click', ()=>{
                socket.emit('forceRemove', viewersKeys[i]);
            })
            userFrame.appendChild(removeButton);

            const drawingPer = document.createElement('button');
            drawingPer.innerHTML = "Pozwól rysować";
            drawingPer.addEventListener('click', ()=>{
                socket.emit('giveDrawingPer', viewersKeys[i], viewers[i].name, viewers[i].lastName);
            })
            userFrame.appendChild(drawingPer);
        }
        boardUsers.appendChild(userFrame);
    }
}