const socket = io();

socket.name = userName;
socket.lastName = userLastName;
socket._id = currentUserId;
socket.groupId = groupId;
socket.profilePic = profilePic;
socket.emit('joinBoardGroup', socket.groupId, socket.name, socket.lastName, socket._id, groupOwner, socket.profilePic);
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

socket.on('sendMessage', (payload, name, lastName, profilePic)=>{
    const sendMessage = document.createElement('div');
	sendMessage.classList.add('row');
	sendMessage.classList.add('p-2');
		
	const userData = document.createElement('span');
	userData.classList.add('col-sm-8');
	userData.classList.add('grad');
	userData.classList.add('borderHighlightRound');
		
	const userImage = document.createElement('div');
	userImage.classList.add('col-sm-3');
		
	const theImage = document.createElement('img');
	theImage.setAttribute('src', profilePic);
	theImage.classList.add('img-thumbnail');
	theImage.classList.add('rounded-circle');
		
	const dataContent = document.createElement('div');
	dataContent.classList.add('d-flex');
	dataContent.classList.add('flex-column');
	dataContent.style.height = "100%";
		
	const sender = document.createElement('div');
	sender.classList.add('d-flex');
	sender.style.height = "50%";
	sender.textContent = `${name} ${lastName}`;

	const message = document.createElement('div');
	message.classList.add('d-flex');
	message.style.height = "50%";
	message.textContent = payload;
		
	dataContent.appendChild(sender);
	dataContent.appendChild(message);
	userData.appendChild(dataContent);
	userImage.appendChild(theImage);
	sendMessage.appendChild(userImage);
	sendMessage.appendChild(userData);

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

socket.on('forceRemove', ()=>{
    const redirect = document.createElement('a');
    redirect.href = '/user/'+socket._id;
    redirect.click();
})

function sendMessage(){
    const payload = textMessageContent.value;
    textMessageContent.value = '';
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
		userFrame.classList.add('row');
		userFrame.classList.add('p-2');
		
		const userData = document.createElement('span');
		userData.classList.add('col-sm-8');
		userData.classList.add('grad');
		userData.classList.add('borderHighlightRound');
		
		const userImage = document.createElement('div');
		userImage.classList.add('col-sm-3');
		
		const theImage = document.createElement('img');
		theImage.setAttribute('src', editors[i].profilePic);
		theImage.classList.add('img-thumbnail');
		theImage.classList.add('rounded-circle');
		
		const dataContent = document.createElement('div');
		dataContent.classList.add('d-flex');
		dataContent.classList.add('flex-column');
		dataContent.style.height = "100%";
		
		const userInfo = document.createElement('div');
		userInfo.classList.add('d-flex');
		userInfo.style.height = "50%";
		userInfo.textContent = `${editors[i].name} ${editors[i].lastName}`;

		const userRole = document.createElement('div');
		userRole.classList.add('d-flex');
		userRole.style.height = "50%";
		if(groupOwner === socket._id){
			userRole.textContent = `Właściciel`;
		} else {
			userRole.textContent = `Edytor`;
		}
		
		dataContent.appendChild(userInfo);
		dataContent.appendChild(userRole);
		userData.appendChild(dataContent);
		userImage.appendChild(theImage);
		userFrame.appendChild(userImage);
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
		userFrame.classList.add('row');
		userFrame.classList.add('p-2');
		
		const userData = document.createElement('span');
		userData.classList.add('col-sm-8');
		userData.classList.add('grad');
		userData.classList.add('borderHighlightRound');
		
		const userImage = document.createElement('div');
		userImage.classList.add('col-sm-3');
		
		const theImage = document.createElement('img');
		theImage.setAttribute('src',viewers[i].profilePic);
		theImage.classList.add('img-thumbnail');
		theImage.classList.add('rounded-circle');
		
		const dataContent = document.createElement('div');
		dataContent.classList.add('d-flex');
		dataContent.classList.add('flex-column');
		dataContent.style.height = "100%";
		
		const userInfo = document.createElement('div');
		userInfo.classList.add('d-flex');
		userInfo.style.height = "50%";
		userInfo.textContent = `${viewers[i].name} ${viewers[i].lastName}`;

		const userRole = document.createElement('div');
		userRole.classList.add('d-flex');
		userRole.style.height = "50%";
		userRole.textContent = `Widz`;
		
		dataContent.appendChild(userInfo);
		dataContent.appendChild(userRole);
		userData.appendChild(dataContent);
		userImage.appendChild(theImage);
		userFrame.appendChild(userImage);
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