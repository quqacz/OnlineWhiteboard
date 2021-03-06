const canvas = document.querySelector('#canvas');
const ctx = canvas.getContext('2d');

const clear = document.querySelector('#clear');

const rubber = document.querySelector('#rubber');
const path = document.querySelector('#path');
const line = document.querySelector('#line');
const rect = document.querySelector('#rect');
const ellipse = document.querySelector('#ellipse');

const lineColorPicker = document.querySelector('#lineColor');
const lineWidth = document.querySelector('#lineWidth');

const uczestnicy = document.querySelector('#uczestnicy');
const czat = document.querySelector('#chat');

const boardUsers = document.querySelector('#connectedUsers');
const boardChat = document.querySelector('#chatBox');

const sendMessageButton = document.querySelector('#sendChatMessage');
const textMessageContent = document.querySelector('#textMessageContent');
const chatBoxMessages = document.querySelector('#chatBoxMessages');

const toolbarControls = [rubber, path, line, rect, ellipse];
const sidePanelControls = [uczestnicy, czat];


let canvasDimentions = {
    width: canvas.width,
    height: canvas.height
}

let isViewer = true;

const settings = {
    tolerance: 2,
    tool: 'RYSIK',
    strokeWidth: 1,
    strokeColor: 'black',
    rubberSize: 20,
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

rubber.addEventListener('click', ()=>{
    settings.tool = 'GUMKA';
    removeStyle(toolbarControls, "active")
    rubber.classList.add('active');
})

path.addEventListener('click', ()=>{
    settings.tool = 'RYSIK';
    removeStyle(toolbarControls, "active")
    path.classList.add('active');
    redrawCanvas(canvasContent);
})

line.addEventListener('click', ()=>{
    settings.tool = 'LINIA';
    removeStyle(toolbarControls, "active")
    line.classList.add('active');
    redrawCanvas(canvasContent);
})

rect.addEventListener('click', ()=>{
    settings.tool = 'PROSTOKAT';
    removeStyle(toolbarControls, "active")
    rect.classList.add('active');
    redrawCanvas(canvasContent);
})

ellipse.addEventListener('click', ()=>{
    settings.tool = 'ELIPSA';
    removeStyle(toolbarControls, "active")
    ellipse.classList.add('active');
    redrawCanvas(canvasContent);
})

clear.addEventListener('click', ()=>{
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
    if(!drawing && settings.tool!=='GUMKA') return;

    if(settings.tool === 'RYSIK'){
        canvasContent.lines[canvasContent.lines.length-1].push(new Point(mousePos.x, mousePos.y, settings.strokeWidth, settings.strokeColor, canvasDimentions));
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.lineTo(mousePos.x, mousePos.y);
        ctx.stroke();
        sendLastPoint();
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
    }else if(settings.tool === 'GUMKA'){
        redrawCanvas(canvasContent);
        drawRubber();
    }

    if(settings.tool !== 'GUMKA' && settings.tool !== 'RYSIK')
        sendCanvasContent();
})

canvas.addEventListener('mousedown', ()=>{
    if(isViewer) return;

    if(settings.tool === 'RYSIK'){
        canvasContent.lines.push([]);
        canvasContent.lines[canvasContent.lines.length-1].push(new Point(mousePos.x, mousePos.y, settings.strokeWidth, settings.strokeColor, canvasDimentions));
        drawing = true;
        ctx.lineWidth = settings.strokeWidth;
        ctx.strokeStyle = settings.strokeColor;
        ctx.moveTo(mousePos.x, mousePos.y);
        ctx.beginPath();
        pushNewPath();
    }else if(settings.tool === 'LINIA'){
        canvasContent.tmpLine = new Shape(mousePos.x, mousePos.y, mousePos.x, mousePos.y, settings.strokeWidth, settings.strokeColor, canvasDimentions);
        drawing = true;
    }else if(settings.tool === 'PROSTOKAT'){
        canvasContent.tmpRect = new Shape(mousePos.x, mousePos.y, mousePos.x, mousePos.y, settings.strokeWidth, settings.strokeColor, canvasDimentions);
        drawing = true;
    }else if(settings.tool === 'ELIPSA'){
        canvasContent.tmpEllipse = new Elipse(mousePos.x, mousePos.y, settings.strokeWidth, settings.strokeColor, canvasDimentions);
        drawing = true;
    }else if(settings.tool === 'GUMKA'){
        clearTmps();
        if(removePoints(mousePos.x, mousePos.y, canvasDimentions) || 
        removeLines(mousePos.x, mousePos.y, settings.rubberSize, canvasDimentions) || 
        removeRects(mousePos.x, mousePos.y, canvasDimentions) ||
        removeEllipses(mousePos.x, mousePos.y, canvasDimentions)){
            sendCanvasContent();
        }
    }
})

canvas.addEventListener('mouseup', ()=>{
    if(isViewer) return;

    if(settings.tool === 'RYSIK'){
        canvasContent.lines[canvasContent.lines.length-1].push(new Point(mousePos.x, mousePos.y, settings.strokeWidth, settings.strokeColor, canvasDimentions));
        drawing = false;
        simplifyLine(canvasContent.lines[canvasContent.lines.length - 1], settings.tolerance);
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

    clearTmps();
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

function drawRubber(){
    ctx.strokeStyle = 'black';
    ctx.lineWidth = .5;
    ctx.beginPath();
    ctx.arc(mousePos.x, mousePos.y, settings.rubberSize/2, 0, Math.PI * 2, false);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(mousePos.x, mousePos.y - 1.2 * settings.rubberSize);
    ctx.lineTo(mousePos.x, mousePos.y + 1.2 * settings.rubberSize);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(mousePos.x - 1.2 * settings.rubberSize, mousePos.y);
    ctx.lineTo(mousePos.x + 1.2 * settings.rubberSize, mousePos.y);
    ctx.stroke();
}

function removePoints(x, y, dimentions){
    for(let i = canvasContent.lines.length - 1; i >= 0; i--){
        let points = canvasContent.lines[i].filter((e)=> {return isInRange(e, settings.rubberSize/dimentions.width, x/dimentions.width, y/dimentions.height)})
        if(points.length){
            canvasContent.lines.splice(i,1);
            redrawCanvas(canvasContent);
            return true;
        }
    }
    return false;
}

function removeLines(x, y, r, dimentions){
    for(let i = 0; i < canvasContent.Lines.length; i++){
        if(checkLineCircleHitbox(x, y, r, canvasContent.Lines[i], dimentions)){
            canvasContent.Lines.splice(i,1);
            redrawCanvas(canvasContent);
            return true;
        }
    }
    return false;
}

function checkLineCircleHitbox(x, y, r, line, dimentions){
    let coordinats = calculateDimentions(line, dimentions);
    let m = (coordinats.y - coordinats.y1) / (coordinats.x - coordinats.x1);
    let n = coordinats.y - m * coordinats.x;
    
    if(!(x >= Math.min(coordinats.x, coordinats.x1) && x <= Math.max(coordinats.x, coordinats.x1))){
            return false;
        }

    // circle: (X - x)^2 + (Y - y)^2 = r^2
    // line: y = m * x + c
    // r: circle radius
    // x: x value of circle centre
    // y: y value of circle centre
    // m: slope
    // n: y-intercept
    
    let a = 1 + m**2;
    let b = -x * 2 + (m * (n - y)) * 2;
    let c = x**2 + (n-y)**2 - r**2;

    let d = b**2 - 4 * a * c;
    if(d >= 0){
        return true;
    }else{
        return false;
    }
}

function calculateDimentions(line, dimentions){
    return {x: line.x * dimentions.width, y: line.y * dimentions.height, x1: line.baseX * dimentions.width, y1: line.baseY * dimentions.height};
}

function removeRects(x, y, dim){
    for(let i = 0; i < canvasContent.rects.length; i++){
        if(checkRectHitbox(x, y, canvasContent.rects[i], dim)){
            canvasContent.rects.splice(i, 1);
            redrawCanvas(canvasContent);
            return true;
        }
    }
}

function checkRectHitbox(x, y, rect, dim){
    let coordinats = calculateDimentions(rect, dim);
    if( (x <= coordinats.x + settings.rubberSize/2 && x >= coordinats.x - settings.rubberSize/2 && y <= Math.max(coordinats.y, coordinats.y1) && y>= Math.min(coordinats.y, coordinats.y1))||
    (y <= coordinats.y + settings.rubberSize/2 && y >= coordinats.y - settings.rubberSize/2 && x >= Math.min(coordinats.x, coordinats.x1) && x <= Math.max(coordinats.x, coordinats.x1)) ||
    (x <= coordinats.x1 + settings.rubberSize/2 && x >= coordinats.x1 - settings.rubberSize/2 && y <= Math.max(coordinats.y, coordinats.y1) && y>= Math.min(coordinats.y, coordinats.y1)) ||
    (y <= coordinats.y1 + settings.rubberSize/2 && y >= coordinats.y1 - settings.rubberSize/2 && x >= Math.min(coordinats.x, coordinats.x1) && x <= Math.max(coordinats.x, coordinats.x1))
    ){
        return true;
    }else{
        return false;
    }
}

function removeEllipses(x, y, dimentions){
    for(let i = 0; i < canvasContent.ellipses.length; i++){
        if(checkElipseHitbox(x, y, canvasContent.ellipses[i], dimentions)){
            canvasContent.ellipses.splice(i, 1);
            redrawCanvas(canvasContent);
            return true;
        }
    }
    return false;
}

function checkElipseHitbox(x, y, ellipse, dimentions){
    return isInRangeEllipse({x: ellipse.baseX * dimentions.width, y: ellipse.baseY * dimentions.height}, ellipse.r * dimentions.width, x, y, settings.rubberSize);
}

function isInRange(point, r, x, y){
    const dx = x - point.x;
    const dy = y - point.y;
    const dist = dx**2 + dy**2;
    if(dist < r** 2)
        return true;
    return false;
}

function isInRangeEllipse(point, r, x, y, range){
    const dx = x - point.x;
    const dy = y - point.y;
    const dist = dx**2 + dy**2;
    if(dist <= (r + range) ** 2 && dist >= (r - range) **2)
        return true;
    return false;
}

function clearTmps(){
    canvasContent.tmpRect = null;
    canvasContent.tmpLine = null;
    canvasContent.tmpEllipse = null;
}

function simplifyLine(points, tolerance){
    for(let i = 0; i < points.length - 2; i++){
        if(isInRange(points[i], tolerance, points[i+1].x, points[i+1].y)){
            points.splice(i+1, 1);
        }
    }
}

class Point{
	constructor(x, y, size, color, dimentions = {}){
		this.x = x / dimentions.width;
		this.y = y / dimentions.height;
		this.size = size;
		this.color = color;
	}
}

class Shape{
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