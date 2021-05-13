const canvas = document.querySelector('#canvas');
const ctx = canvas.getContext('2d');

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

const toolbarControls = [gumka, rysik, linia, prostokat, elipsa];
const sidePanelControls = [uczestnicy, czat];

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
    Lines: [],
    rects: [],
    ellipses: [],
    tmpLine: null,
    tmpRect: null,
    tmpEllipse: null
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
})

rysik.addEventListener('click', ()=>{
    settings.tool = 'RYSIK';
    removeStyle(toolbarControls, "active")
    rysik.classList.add('active');
})

linia.addEventListener('click', ()=>{
    settings.tool = 'LINIA';
    removeStyle(toolbarControls, "active")
    linia.classList.add('active');
})

prostokat.addEventListener('click', ()=>{
    settings.tool = 'PROSTOKAT';
    removeStyle(toolbarControls, "active")
    prostokat.classList.add('active');
})

elipsa.addEventListener('click', ()=>{
    settings.tool = 'ELIPSA';
    removeStyle(toolbarControls, "active")
    elipsa.classList.add('active');
})

wyczysc.addEventListener('click', ()=>{
    canvasContent.lines.length = 0;
    canvasContent.Lines.length = 0;
    canvasContent.rects.length = 0;
    canvasContent.ellipses.length = 0;
    canvasContent.tmpLine = null;
    canvasContent.tmpRect = null;
    canvasContent.tmpEllipse = null;
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
    if(!drawing) return;

    if(settings.tool === 'RYSIK'){
        canvasContent.lines.push(new Point(mousePos.x, mousePos.y, settings.strokeWidth, settings.strokeColor, true, canvasDimentions, false));
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.lineTo(mousePos.x, mousePos.y);
        ctx.stroke();
    }else if(settings.tool === 'LINIA'){
        canvasContent.tmpLine.x = (mousePos.x / canvasDimentions.width);
        canvasContent.tmpLine.y = (mousePos.y / canvasDimentions.height);
        redrawCanvas(canvasContent);
    }else if(settings.tool === 'PROSTOKAT'){
        canvasContent.tmpRect.x = (mousePos.x / canvasDimentions.width);
        canvasContent.tmpRect.y = (mousePos.y / canvasDimentions.height);
        redrawCanvas(canvasContent);
    }else if(settings.tool === 'ELIPSA'){
        canvasContent.tmpEllipse.calculateR(mousePos.x / canvasDimentions.width, mousePos.y / canvasDimentions.height);
        redrawCanvas(canvasContent);
    }
    sendCanvasContent();
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
    }else if(settings.tool === 'LINIA'){
        canvasContent.tmpLine = new Line(mousePos.x, mousePos.y, mousePos.x, mousePos.y, settings.strokeWidth, settings.strokeColor, canvasDimentions);
        drawing = true;
    }else if(settings.tool === 'PROSTOKAT'){
        canvasContent.tmpRect = new Rect(mousePos.x, mousePos.y, mousePos.x, mousePos.y, settings.strokeWidth, settings.strokeColor, canvasDimentions);
        drawing = true;
    }else if(settings.tool === 'ELIPSA'){
        canvasContent.tmpEllipse = new Elipse(mousePos.x, mousePos.y, settings.strokeWidth, settings.strokeColor, canvasDimentions);
        drawing = true;
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
    }else if(settings.tool === 'LINIA'){
        canvasContent.Lines.push(canvasContent.tmpLine);
        canvasContent.tmpLine = null;
        drawing = false;
        redrawCanvas(canvasContent);
        sendCanvasContent();
    }else if(settings.tool === 'PROSTOKAT'){
        canvasContent.rects.push(canvasContent.tmpRect);
        canvasContent.tmpRine = null;
        drawing = false;
        redrawCanvas(canvasContent);
        sendCanvasContent();
    }else if(settings.tool === 'ELIPSA'){
        canvasContent.ellipses.push(canvasContent.tmpEllipse);
        canvasContent.tmpEllipse = null;
        drawing = false;
        redrawCanvas(canvasContent);
        sendCanvasContent();
    }
})

window.addEventListener('resize', ()=>{
    resizeCanvas();
    redrawCanvas(canvasContent);
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
    redrawCanvas(canvasContent);
}

function renderPoints(linesArray){
    ctx.beginPath();
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
            }
        }
    }
    ctx.stroke();
    ctx.beginPath();
    
}

function renderLines(lines){
    for(let i = 0; i < lines.length; i ++){
        renderLine(lines[i]);
    }
}

function renderLine(line){
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.beginPath();
    ctx.moveTo(line.baseX * canvasDimentions.width, line.baseY * canvasDimentions.height);
    ctx.lineWidth = line.size;
    ctx.strokeStyle = line.color;
    ctx.lineTo(line.x * canvasDimentions.width, line.y * canvasDimentions.height);
    ctx.closePath();
    ctx.stroke();
}

function renderRects(rects){
    for(let i = 0; i < rects.length; i++)
        renderRect(rects[i]);
}

function renderRect(rect){
    ctx.lineWidth = rect.size;
    ctx.strokeStyle = rect.color;
    ctx.strokeRect(rect.baseX * canvasDimentions.width, rect.baseY * canvasDimentions.height, (rect.x - rect.baseX) * canvasDimentions.width, (rect.y - rect.baseY) * canvasDimentions.height);
}

function renderEllipses(ellipses){
    for(let i = 0; i < ellipses.length; i++){
        renderEllipse(ellipses[i]);
    }
}

function renderEllipse(ellipse){
    ctx.lineWidth = ellipse.size;
    ctx.strokeStyle = ellipse.color;
    ctx.beginPath();
    ctx.arc(ellipse.baseX * canvasDimentions.width, ellipse.baseY * canvasDimentions.height, ellipse.r * canvasDimentions.width, 0, Math.PI * 2, false);
    ctx.stroke();
    ctx.closePath();
}

function redrawCanvas(content){
    ctx.clearRect(0,0, canvas.width, canvas.height);
    renderPoints(content.lines);
    renderLines(content.Lines);
    renderRects(content.rects);
    renderEllipses(content.ellipses);
    if(content.tmpLine)
        renderLine(content.tmpLine);
    if(content.tmpRect)
        renderRect(content.tmpRect);
    if(content.tmpEllipse)
        renderEllipse(content.tmpEllipse);
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

class Line{
    constructor(baseX, baseY, x, y, size, color, dimentions = {}){
        this.baseX = baseX / dimentions.width;
        this.baseY = baseY / dimentions.height;
		this.x = x / dimentions.width;
		this.y = y / dimentions.height;
        this.size = size;
        this.color = color;
    }
}

class Rect{
    constructor(baseX, baseY, x, y, size, color, dimentions = {}){
        this.baseX = baseX / dimentions.width;
        this.baseY = baseY / dimentions.height;
		this.x = x / dimentions.width;
		this.y = y / dimentions.height;
        this.size = size;
        this.color = color;
    }
}

class Elipse{
    constructor(baseX, baseY, size, color, dimentions = {}){
        this.baseX = baseX / dimentions.width;
        this.baseY = baseY / dimentions.height;
        this.r = 0;
        this.size = size;
        this.color = color;
        this.w = dimentions.width;
    }
    calculateR = function(x, y){
        let dist = Math.sqrt((x-this.baseX)**2 + (y-this.baseY)**2);
        this.r = dist;
    }
}