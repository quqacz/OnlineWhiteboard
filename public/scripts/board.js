const canvas = document.querySelector('#canvas');
const ctx = canvas.getContext('2d');

const gumka = document.querySelector('#gumka');
const rysik = document.querySelector('#rysik');
const linia = document.querySelector('#linia');

const uczestnicy = document.querySelector('#uczestnicy');
const czat = document.querySelector('#chat');

const boardUsers = document.querySelector('#connectedUsers');
const boardChat = document.querySelector('#chatBox');

const sendMessageButton = document.querySelector('#sendChatMessage');
const textMessageContent = document.querySelector('#textMessageContent');
const chatBoxMessages = document.querySelector('#chatBoxMessages');

const toolbarControls = [gumka, rysik, linia];
const sidePanelControls = [uczestnicy, czat];

let canvasDimentions = {
    width: canvas.width,
    height: canvas.height
}

const settings = {
    tool: 'RYSIK',
    strokeWidth: 1,
    strokeColor: 'black',
    rubberSize: 10,
    backgroundFill: 'white'
}

const lines = [];

const mousePos = {
    x: 0,
    y: 0
}

let drawing = false;

let lastCanvasContent = '';

gumka.addEventListener('click', ()=>{
    settings.tool = 'GUMKA';
    removeActiveStyle(toolbarControls)
    gumka.classList.add('active');
})

rysik.addEventListener('click', ()=>{
    settings.tool = 'RYSIK';
    removeActiveStyle(toolbarControls)
    rysik.classList.add('active');
})

linia.addEventListener('click', ()=>{
    settings.tool = 'LINIA';
    removeActiveStyle(toolbarControls)
    linia.classList.add('active');
})

czat.addEventListener('click', ()=>{
    removeActiveStyle(sidePanelControls);
    czat.classList.add('active');
})

czat.addEventListener('click', ()=>{
    removeActiveStyle(sidePanelControls);
    czat.classList.add('active');
    boardUsers.classList.add('hideElement');
    boardChat.classList.remove('hideElement');
})

uczestnicy.addEventListener('click', ()=>{
    removeActiveStyle(sidePanelControls);
    uczestnicy.classList.add('active');
    boardChat.classList.add('hideElement');
    boardUsers.classList.remove('hideElement');
})

sendMessageButton.addEventListener('click', ()=>{
    sendMessage();
});

canvas.addEventListener('mousemove', (event)=>{
    mousePos.x = event.offsetX;
    mousePos.y = event.offsetY;
    if(settings.tool === 'RYSIK' && drawing){
        lines.push(new Point(mousePos.x, mousePos.y, settings.strokeWidth, settings.strokeColor, true, canvasDimentions, false));
        ctx.lineTo(mousePos.x, mousePos.y);
        ctx.stroke();
        sendCanvasContentToViewers();
    }
})

canvas.addEventListener('mousedown', ()=>{
    if(settings.tool === 'RYSIK'){
        lines.push(new Point(mousePos.x, mousePos.y, settings.strokeWidth, settings.strokeColor, true, canvasDimentions, true));
        drawing = true;
        ctx.lineWidth = settings.strokeWidth;
        ctx.strokeStyle = settings.strokeColor;
        ctx.moveTo(mousePos.x, mousePos.y);
        ctx.beginPath();
    }
})

canvas.addEventListener('mouseup', ()=>{
    if(settings.tool === 'RYSIK'){
        lines.push(new Point(mousePos.x, mousePos.y, settings.strokeWidth, settings.strokeColor, true, canvasDimentions, false));
        lines.push(new Point(mousePos.x, mousePos.y, settings.strokeWidth, settings.strokeColor, false, canvasDimentions, false));
        drawing = false;
        ctx.lineTo(mousePos.x, mousePos.y);
        ctx.stroke();
        ctx.closePath();
    }
})

window.addEventListener('resize', ()=>{
    resizeCanvas();
})


resizeCanvas();

function removeActiveStyle(toolbarControls){
    for(tool of toolbarControls)
        tool.classList.remove('active');
}

function resizeCanvas(){
    const ratio = 827/1575;
    let parentW = canvas.parentNode.clientWidth-12;
    let height = ratio * parentW;
    canvas.width = parentW;
    canvas.height = height;
    boardChat.setAttribute("style",`height:${height}px`);
    boardUsers.setAttribute("style",`height:${height}px`);
    boardUsers.parentNode.setAttribute("style",`height:${height}px`);
    canvasDimentions.width = parentW;
    canvasDimentions.height = height;
    renderPoints();
}

function renderPoints(){
    for(let i = 0; i < lines.length; i++){
        if(lines[i].isControl){
            ctx.moveTo(lines[i].x * canvasDimentions.width, lines[i].y * canvasDimentions.height);
            ctx.beginPath();
            ctx.lineWidth = lines[i].size;
            ctx.strokeStyle = lines[i].color;
        }else{
            if(lines[i].drawable){
                ctx.lineTo(lines[i].x * canvasDimentions.width, lines[i].y * canvasDimentions.height)
            }else{
                ctx.lineTo(lines[i].x * canvasDimentions.width, lines[i].y * canvasDimentions.height)
                ctx.stroke();
                ctx.closePath();
            }
        }
        
    }
}

class Point{
	constructor(x, y, size, color, drawable, dimentions = {}, isControl){
		this.x = x / dimentions.width;
		this.y = y / dimentions.height;
        this.isControl = isControl;
		this.size = size;
		this.color = color;
        this.drawable = drawable;
	}
}