/* Establishes the main component in a functioning quiz(allows to connect to multiple files to produce different questions for each one.)
Question details inside html files */

let currentQuestionIndex = 0;
let score = 0;

const questionEl = document.getElementById("question-text");
const optionsContainer = document.getElementById("options-container");
const explanationBox = document.getElementById("explanation-box");
const nextBtn = document.getElementById("next-btn");

function shuffleQuizData() {
    for (let i = quizData.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        // Swap elements
        [quizData[i], quizData[j]] = [quizData[j], quizData[i]];
    }
}
// Shuffles quiz questions to make it randomized
shuffleQuizData();

// Function to load next question
function loadQuestion() {
    explanationBox.style.display = "none";
    nextBtn.style.display = "none";
    optionsContainer.innerHTML = "";

    const currentQuiz = quizData[currentQuestionIndex];
    questionEl.innerText = currentQuiz.question;

    // 1. Check if the question is a free-response text question
    if (currentQuiz.type === "text") {
        // Create a textarea element instead of an input field
        const inputField = document.createElement("textarea");
        inputField.id = "free-response-input";
        inputField.placeholder = "Type your answer here...";
        inputField.rows = 1; // Start off with one row
        
        // Dynamically adjust height as the user types
        inputField.addEventListener("input", function () {
            this.style.height = "auto"; // Reset height to calculate the correct scrollHeight
            this.style.height = (this.scrollHeight) + "px"; // Set to new content height
        });

        optionsContainer.appendChild(inputField);

        // Create a submit button for the text answer
        const submitBtn = document.createElement("button");
        submitBtn.innerText = "Submit Answer";
        submitBtn.classList.add("option-btn");
        submitBtn.addEventListener("click", () => selectAnswer(null, null, inputField.value));
        optionsContainer.appendChild(submitBtn);

    } else {
        // 2. Default to Multiple Choice if type isn't "text"
        currentQuiz.options.forEach((option, index) => {
            const button = document.createElement("button");
            button.innerText = option;
            button.classList.add("option-btn");
            button.addEventListener("click", () => selectAnswer(index, button));
            optionsContainer.appendChild(button);
        });
    }
}

// Decides if answer chosen is correct (updated to skip verification for text questions)
function selectAnswer(selectedIndex, selectedButton, textValue = "") {
    const currentQuiz = quizData[currentQuestionIndex];
    
    if (currentQuiz.type === "text") {
        const inputField = document.getElementById("free-response-input");
        const submitBtn = optionsContainer.querySelector("button");
        
        // Disable input and button after submission so they can't change it
        inputField.disabled = true;
        submitBtn.disabled = true;

        score++

        // Visual feedback just to show it was submitted successfully
        inputField.style.borderColor = "#ccc";
        inputField.style.backgroundColor = "#f5f5f5";

    } else {
        // Handle Multiple Choice (Checks correctness normally)
        const allButtons = optionsContainer.querySelectorAll(".option-btn");
        allButtons.forEach(btn => btn.disabled = true);

        if (selectedIndex === currentQuiz.correct) {
            selectedButton.classList.add("correct");
            score++;
        } else {
            selectedButton.classList.add("wrong");
            allButtons[currentQuiz.correct].classList.add("correct");
        }
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

