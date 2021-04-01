const canvas = document.querySelector('#canvas');
const ctx = canvas.getContext('2d');

const gumka = document.querySelector('#gumka');
const rysik = document.querySelector('#rysik');
const linia = document.querySelector('#linia');

const toolbarControls = [gumka, rysik, linia];

const settings = {
    tool: 'RYSIK',
    strokeWidth: 1,
    StrokeColor: 'black',
    rubberSize: 10,
    backgroundFill: 'white'
}

gumka.addEventListener('click', ()=>{
    settings.tool = 'GUMKA';
    removeActiveStyle()
    gumka.classList.add('active');
})

rysik.addEventListener('click', ()=>{
    settings.tool = 'RYSIK';
    removeActiveStyle()
    rysik.classList.add('active');
})

linia.addEventListener('click', ()=>{
    settings.tool = 'LINIA';
    removeActiveStyle()
    linia.classList.add('active');
})

window.addEventListener('resize', ()=>{
    resizeCanvas();
})

resizeCanvas();

function removeActiveStyle(){
    for(tool of toolbarControls)
        tool.classList.remove('active');
}

function resizeCanvas(){
    const ratio = 827/1575;
    let parentW = canvas.parentNode.clientWidth-12;
    let height = ratio * parentW;
    console.log(`${parentW}: ${height}`);
    canvas.width = parentW;
    canvas.height = height;
}