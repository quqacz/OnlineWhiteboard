const canvas = document.querySelector('#canvas');
const ctx = canvas.getContext('2d');

const nowaTablica = document.querySelector('#nowaTablica');
const wyczysc = document.querySelector('#wyczysc');

const gumka = document.querySelector('#gumka');
const rysik = document.querySelector('#rysik');
const linia = document.querySelector('#linia');
const prostokat = document.querySelector('#prostokat');
const elipsa = document.querySelector('#elipsa');

const lineColorPicker = document.querySelector('#lineColor');
const lineWidth = document.querySelector('#lineWidth');


const uczestnicy = document.querySelector('#uczestnicy');
const czat = document.querySelector('#chat');

const boardUsers = document.querySelector('#connectedUsers');
const boardChat = document.querySelector('#chatBox');

const sendMessageButton = document.querySelector('#sendChatMessage');
const textMessageContent = document.querySelector('#textMessageContent');
const chatBoxMessages = document.querySelector('#chatBoxMessages');


const lineControl = document.querySelector('#lineControls');
const rubberControl = document.querySelector('#rubberControls');
const shapeControl = document.querySelector('#shapeControls');

const toolbarControls = [gumka, rysik, linia, prostokat, elipsa];
const sidePanelControls = [uczestnicy, czat];
const toolSettings = [lineControl, rubberControl, shapeControl];

let canvasDimentions = {
    width: canvas.width,
    height: canvas.height
}

let isViewer = true;

const settings = {
    tool: 'RYSIK',
    strokeWidth: 1,
    strokeColor: 'black',
    rubberSize: 10,
    backgroundFill: 'white'
}

const canvasContent = {
    lines: [],
    shapes: []
}

const mousePos = {
    x: 0,
    y: 0
}

let drawing = false;

let lastCanvasURI = '';

gumka.addEventListener('click', ()=>{
    settings.tool = 'GUMKA';
    removeStyle(toolbarControls, "active")
    gumka.classList.add('active');
    addStyle(toolSettings, "hideElement");
    rubberControl.classList.remove('hideElement');
})

rysik.addEventListener('click', ()=>{
    settings.tool = 'RYSIK';
    removeStyle(toolbarControls, "active")
    rysik.classList.add('active');
    addStyle(toolSettings, "hideElement");
    lineControl.classList.remove('hideElement');
})

linia.addEventListener('click', ()=>{
    settings.tool = 'LINIA';
    removeStyle(toolbarControls, "active")
    linia.classList.add('active');
    addStyle(toolSettings, "hideElement");
    lineControl.classList.remove('hideElement');
})

prostokat.addEventListener('click', ()=>{
    settings.tool = 'PROSTOKAT';
    removeStyle(toolbarControls, "active")
    prostokat.classList.add('active');
    addStyle(toolSettings, "hideElement");
    shapeControl.classList.remove('hideElement');
})

elipsa.addEventListener('click', ()=>{
    settings.tool = 'PROSTOKAT';
    removeStyle(toolbarControls, "active")
    elipsa.classList.add('active');
    addStyle(toolSettings, "hideElement");
    shapeControl.classList.remove('hideElement');
})

wyczysc.addEventListener('click', ()=>{
    canvasContent.lines.length = 0;
    ctx.clearRect(0, 0, canvasDimentions.width, canvasDimentions.height);
    sendCanvasContent();
})

nowaTablica.addEventListener('click', ()=>{
    canvasContent.lines.length = 0;
    ctx.clearRect(0, 0, canvasDimentions.width, canvasDimentions.height);
    sendCanvasContent();
})

lineColorPicker.addEventListener('change', ()=>{
    settings.strokeColor = lineColorPicker.value;
})

lineWidth.addEventListener('change', ()=>{
    settings.strokeWidth = lineWidth.value;
})

czat.addEventListener('click', ()=>{
    removeStyle(sidePanelControls, "active");
    czat.classList.add('active');
    boardUsers.classList.add('hideElement');
    boardChat.classList.remove('hideElement');
})

uczestnicy.addEventListener('click', ()=>{
    removeStyle(sidePanelControls, "active");
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

    if(isViewer) return;

    if(settings.tool === 'RYSIK' && drawing){
        canvasContent.lines.push(new Point(mousePos.x, mousePos.y, settings.strokeWidth, settings.strokeColor, true, canvasDimentions, false));
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.lineTo(mousePos.x, mousePos.y);
        ctx.stroke();
        sendCanvasContent();
    }
})

canvas.addEventListener('mousedown', ()=>{
    if(isViewer) return;

    if(settings.tool === 'RYSIK'){
        canvasContent.lines.push(new Point(mousePos.x, mousePos.y, settings.strokeWidth, settings.strokeColor, true, canvasDimentions, true));
        drawing = true;
        ctx.lineWidth = settings.strokeWidth;
        ctx.strokeStyle = settings.strokeColor;
        ctx.moveTo(mousePos.x, mousePos.y);
        ctx.beginPath();
    }
})

canvas.addEventListener('mouseup', ()=>{
    if(isViewer) return;

    if(settings.tool === 'RYSIK'){
        canvasContent.lines.push(new Point(mousePos.x, mousePos.y, settings.strokeWidth, settings.strokeColor, true, canvasDimentions, false));
        canvasContent.lines.push(new Point(mousePos.x, mousePos.y, settings.strokeWidth, settings.strokeColor, false, canvasDimentions, false));
        drawing = false;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.lineTo(mousePos.x, mousePos.y);
        ctx.stroke();
        ctx.closePath();
        sendCanvasContent();
    }
})

window.addEventListener('resize', ()=>{
    resizeCanvas();
    renderPoints(canvasContent.lines);
})


setup();

function setup(){
    resizeCanvas();
    lineWidth.value = "1";
    lineColorPicker.value = "#000000";
}

function removeStyle(toolbarControls, klasa){
    for(tool of toolbarControls)
        tool.classList.remove(klasa);
}

function addStyle(toolbarControls, klasa){
    for(tool of toolbarControls)
        tool.classList.add(klasa);
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
    renderPoints(canvasContent.lines);
}

function renderPoints(linesArray){
    for(let i = 0; i < linesArray.length; i++){
        if(linesArray[i].isControl){
            ctx.moveTo(linesArray[i].x * canvasDimentions.width, linesArray[i].y * canvasDimentions.height);
            ctx.beginPath();
            ctx.lineWidth = linesArray[i].size;
            ctx.strokeStyle = linesArray[i].color;
        }else{
            if(linesArray[i].drawable){
                ctx.lineCap = "round";
                ctx.lineJoin = "round";
                ctx.lineTo(linesArray[i].x * canvasDimentions.width, linesArray[i].y * canvasDimentions.height)
            }else{
                ctx.lineCap = "round";
                ctx.lineJoin = "round";
                ctx.lineTo(linesArray[i].x * canvasDimentions.width, linesArray[i].y * canvasDimentions.height)
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