/* Establishes the main component in a functioning quiz(allows to connect to multiple files to produce different questions for each one.)
Question details inside html files */

let currentQuestionIndex = 0;
let score = 0;

const questionEl = document.getElementById("question-text");
const optionsContainer = document.getElementById("options-container");
const explanationBox = document.getElementById("explanation-box");
const nextBtn = document.getElementById("next-btn");

// Function to load next question
function loadQuestion() {
    explanationBox.style.display = "none";
    nextBtn.style.display = "none";
    optionsContainer.innerHTML = "";

    // quizData must be defined globally before this file runs
    const currentQuiz = quizData[currentQuestionIndex];
    questionEl.innerText = currentQuiz.question;

    currentQuiz.options.forEach((option, index) => {
        const button = document.createElement("button");
        button.innerText = option;
        button.classList.add("option-btn");
        button.addEventListener("click", () => selectAnswer(index, button));
        optionsContainer.appendChild(button);
    });
}

// Decides if answer chosen is correct
function selectAnswer(selectedIndex, selectedButton) {
    const currentQuiz = quizData[currentQuestionIndex];
    const allButtons = optionsContainer.querySelectorAll(".option-btn");

    allButtons.forEach(btn => btn.disabled = true);

    if (selectedIndex === currentQuiz.correct) {
        selectedButton.classList.add("correct");
        score++;
    } else {
        selectedButton.classList.add("wrong");
        allButtons[currentQuiz.correct].classList.add("correct");
    }

    explanationBox.innerText = `Explanation: ${currentQuiz.explanation}`;
    explanationBox.style.display = "block";
    nextBtn.style.display = "block";
}

// Go to next question or display results in quiz
nextBtn.addEventListener("click", () => {
    currentQuestionIndex++;
    if (currentQuestionIndex < quizData.length) {
        loadQuestion();
    } else {
        const percentscore = Math.round((score / quizData.length) * 100)
        document.querySelector(".container").innerHTML = `
            <div id="endofquiz">
                <h2>🎉 Quiz Completed!</h2>
                <p>You have answered all the questions.</p>
                <h3>Your final score is:</h3>
                <h3><strong>${percentscore}%</strong></h3>
                <p>You can <a href="humangeo.html">redo this quiz</a> or <a href="index.html">pick another one</a>.</p>
            </div>
        `;
    }
});

// Start the quiz automatically once loaded
loadQuestion();
