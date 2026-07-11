const quizScreen=document.getElementById("quizScreen");
const progressText=document.getElementById("progress");
const timerText=document.getElementById("timer");
const questionText=document.getElementById("question");
const optionsBox=document.getElementById("options");

let activeQuiz=null;
let currentQuestionIndex=0;
let userAnswers=[];
let timerId=null;
let timeLeft=30;

function shuffleOptions(options){

    return [...options].sort(()=>Math.random()-.5);

}

function startQuestionTimer(){

    clearInterval(timerId);
    timeLeft=30;
    timerText.textContent=`Time Left: ${timeLeft}s`;

    timerId=setInterval(()=>{

        timeLeft-=1;
        timerText.textContent=`Time Left: ${timeLeft}s`;

        if(timeLeft<=0){
            selectAnswer(null);
        }

    },1000);

}

function renderQuestion(){

    const question=activeQuiz.questions[currentQuestionIndex];

    progressText.textContent=`Question ${currentQuestionIndex+1} of ${activeQuiz.questions.length}`;
    questionText.textContent=question.question;
    optionsBox.innerHTML="";

    shuffleOptions(question.options).forEach(option=>{

        const button=document.createElement("button");
        button.className="option";
        button.type="button";
        button.textContent=option;
        button.addEventListener("click",()=>selectAnswer(option));
        optionsBox.appendChild(button);

    });

    startQuestionTimer();

}

function selectAnswer(answer){

    clearInterval(timerId);

    const question=activeQuiz.questions[currentQuestionIndex];
    const buttons=[...optionsBox.querySelectorAll(".option")];

    buttons.forEach(button=>{
        button.disabled=true;

        if(button.textContent===question.answer){
            button.classList.add("correct");
        }

        if(answer && button.textContent===answer && answer!==question.answer){
            button.classList.add("wrong");
        }
    });

    userAnswers.push({
        question:question.question,
        selected:answer,
        correct:question.answer,
        explanation:question.explanation
    });

    setTimeout(()=>{

        currentQuestionIndex+=1;

        if(currentQuestionIndex>=activeQuiz.questions.length){
            showResult(activeQuiz,userAnswers);
            return;
        }

        renderQuestion();

    },900);

}

function startQuiz(quiz){

    activeQuiz=quiz;
    currentQuestionIndex=0;
    userAnswers=[];

    document.querySelector(".container").style.display="none";
    document.getElementById("loadingScreen").style.display="none";
    document.getElementById("resultScreen").style.display="none";
    quizScreen.style.display="block";
    document.body.classList.add("screen-active");

    renderQuestion();

}
