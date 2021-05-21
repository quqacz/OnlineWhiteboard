function renderPoints(linesArray){
    ctx.beginPath();
    for(let i = 0; i < linesArray.length; i++){
            ctx.moveTo(linesArray[i][0].x * canvasDimentions.width, linesArray[i][0].y * canvasDimentions.height);
            ctx.beginPath();
            ctx.lineWidth = linesArray[i][0].size;
            ctx.strokeStyle = linesArray[i][0].color;
        for(let j = 1; j < linesArray[i].length; j++){
            ctx.lineCap = "round";
            ctx.lineJoin = "round";
            ctx.lineTo(linesArray[i][j].x * canvasDimentions.width, linesArray[i][j].y * canvasDimentions.height);
            ctx.stroke();
        }
    }
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