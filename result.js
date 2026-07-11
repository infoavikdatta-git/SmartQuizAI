const resultScreen=document.getElementById("resultScreen");
const scoreText=document.getElementById("score");
const percentageText=document.getElementById("percentage");
const correctText=document.getElementById("correct");
const wrongText=document.getElementById("wrong");
const skippedText=document.getElementById("skipped");
const reviewBox=document.getElementById("review");

function showResult(quiz,answers){

    const total=answers.length;
    const correct=answers.filter(answer=>answer.selected===answer.correct).length;
    const skipped=answers.filter(answer=>answer.selected===null).length;
    const wrong=total-correct-skipped;
    const percentage=Math.round((correct/total)*100);

    document.querySelector(".container").style.display="none";
    document.getElementById("loadingScreen").style.display="none";
    document.getElementById("quizScreen").style.display="none";
    resultScreen.style.display="block";
    document.body.classList.add("screen-active");

    scoreText.textContent=`${correct}/${total}`;
    percentageText.textContent=`${percentage}% Score - ${quiz.title}`;
    correctText.textContent=`Correct: ${correct}`;
    wrongText.textContent=`Wrong: ${wrong}`;
    skippedText.textContent=`Skipped: ${skipped}`;

    reviewBox.innerHTML="";

    answers.forEach((answer,index)=>{

        const item=document.createElement("div");
        item.className="review-item";

        const selected=answer.selected || "Skipped";

        const title=document.createElement("strong");
        title.textContent=`${index+1}. ${answer.question}`;

        const selectedText=document.createElement("p");
        selectedText.textContent=`Your answer: ${selected}`;

        const correctAnswer=document.createElement("p");
        correctAnswer.textContent=`Correct answer: ${answer.correct}`;

        const explanation=document.createElement("p");
        explanation.textContent=answer.explanation;

        item.appendChild(title);
        item.appendChild(selectedText);
        item.appendChild(correctAnswer);
        item.appendChild(explanation);

        reviewBox.appendChild(item);

    });

    const actions=document.createElement("div");
    actions.className="quiz-actions";

    const restartButton=document.createElement("button");
    restartButton.type="button";
    restartButton.textContent="Try Again";
    restartButton.addEventListener("click",()=>startQuiz(quiz));

    const homeButton=document.createElement("button");
    homeButton.type="button";
    homeButton.className="secondary-button";
    homeButton.textContent="New Quiz";
    homeButton.addEventListener("click",showHome);

    actions.appendChild(restartButton);
    actions.appendChild(homeButton);
    reviewBox.appendChild(actions);

}
