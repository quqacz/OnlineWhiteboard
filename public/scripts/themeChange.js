const element = document.getElementById("bod2");
if(typeof(element) != undefined && element != null){
	document.addEventListener("load", darkSwitch());
}

function darkSwitch() {
    document.body.style.color = "white";

    const sendChatMessage = document.getElementById("sendChatMessage");
    const textMessageContent = document.getElementById("textMessageContent");
    if(sendChatMessage){
        sendChatMessage.classList.add("bg-secondary");
        sendChatMessage.style.color = 'white';
    }

    if(textMessageContent){
        textMessageContent.classList.add("bg-dark")
        textMessageContent.style.color = "white";
    }

    const linki = document.getElementsByClassName("nav-link");
    for(let i = 0; i < linki.length; i++){
        linki[i].style.color = "white";
    }

    const linki2 = document.getElementsByClassName("navbar-brand");
    for(let i = 0; i < linki2.length; i++){
        linki2[i].style.color = "white";
    }

    const borderList_switch = document.getElementsByClassName("borderList");
    while(borderList_switch.length > 0) {
        borderList_switch[0].classList.add("borderList-black");
        borderList_switch[0].classList.remove("borderList");
    }

    const bg_switch = document.getElementsByClassName("bg-light");
    while(bg_switch.length > 0) {
        bg_switch[0].classList.add("bg-dark");
        bg_switch[0].classList.remove("bg-light");
    }

    const grad_switch = document.getElementsByClassName("grad");
    while(grad_switch.length > 0) {
        grad_switch[0].classList.add("grad-dark");
        grad_switch[0].classList.remove("grad");
    }

    const grad_anim_switch = document.getElementsByClassName("grad-anim");
    while(grad_anim_switch.length > 0) {
        grad_anim_switch[0].classList.add("grad-anim-dark");
        grad_anim_switch[0].classList.remove("grad-anim");
    }
}