const socket = io();
const canvasDimentions = {width: 1920, height: 1080};
const canvas = document.querySelector('#canvas');
const ctx = canvas.getContext('2d');
canvas.width = canvasDimentions.width;
canvas.height = canvasDimentions.height;


const canvasContent = {
    lines: [],
    Lines: [],
    rects: [],
    ellipses: []
}

let fileName;

function downloadBoard(boardId, topic){
    socket.emit('requestCanvasContent', boardId);
    fileName = topic;
}

socket.on('getCanvasContent', (jsonObject)=>{
    let content ='';
    if(jsonObject.length !== 0){
        content = JSON.parse(jsonObject);
        canvasContent.lines = content.lines;
        canvasContent.Lines = content.Lines;
        canvasContent.rects = content.rects;
        canvasContent.ellipses = content.ellipses;
        redrawCanvas(content);
        download();
        clear();
    }
})

function download(){
    let link = document.createElement('a');
    link.download = `${fileName}.png`;
    link.href = canvas.toDataURL('image/png').replace("image/png", "image/octet-stream");
    link.click();
}

function clear(){
    canvasContent.lines.length = 0;
    canvasContent.Lines.length = 0;
    canvasContent.rects.length = 0;
    canvasContent.ellipses.length = 0;
    fileName = undefined;
    ctx.clearRect(0,0,canvas.width, canvas.height);
}