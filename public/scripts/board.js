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

const settings = {
    tool: 'RYSIK',
    strokeWidth: 1,
    StrokeColor: 'black',
    rubberSize: 10,
    backgroundFill: 'white'
}

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
}