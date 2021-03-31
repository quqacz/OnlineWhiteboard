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

ctx.fillRect(0,0, canvas.width, canvas.height);

function removeActiveStyle(){
    for(tool of toolbarControls)
        tool.classList.remove('active');
}