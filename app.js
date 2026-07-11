const aiCard=document.getElementById("aiCard");
const uploadCard=document.getElementById("uploadCard");

const aiSection=document.getElementById("aiSection");
const uploadSection=document.getElementById("uploadSection");

function showHome(){

    document.querySelector(".container").style.display="block";
    document.getElementById("loadingScreen").style.display="none";
    document.getElementById("quizScreen").style.display="none";
    document.getElementById("resultScreen").style.display="none";
    document.body.classList.remove("screen-active");

}

function showLoading(message){

    document.querySelector(".container").style.display="none";
    document.getElementById("loadingScreen").style.display="block";
    document.getElementById("quizScreen").style.display="none";
    document.getElementById("resultScreen").style.display="none";
    document.body.classList.add("screen-active");

    const loaderText=document.querySelector("#loadingScreen p");
    if(loaderText && message){
        loaderText.textContent=message;
    }

}

aiCard.addEventListener("click",()=>{

    aiCard.classList.add("active");
    uploadCard.classList.remove("active");

    aiSection.style.display="block";
    uploadSection.style.display="none";

});

uploadCard.addEventListener("click",()=>{

    uploadCard.classList.add("active");
    aiCard.classList.remove("active");

    uploadSection.style.display="block";
    aiSection.style.display="none";

});
