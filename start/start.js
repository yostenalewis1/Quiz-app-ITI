class Answer {
  constructor(text, isCorrect) {
    this.text = text;
    this.isCorrect = isCorrect;
  }
}

class Question {
  constructor(q, answers) {
    this.question = q;
    this.answers = answers;
  }
}

let questions = [];
let currentQuestionIndex = 0;
let score = 0;
let timer;
let timeLeft = 300;
var flag = document.getElementsByClassName("flag")[0];
var imgFlag = flag.querySelector("img");
var markedFlag = false;
var showMarkedFlag = document.getElementById("flagged-questions");
const totalQuestions = 10;
const passingScore = 6;
let answers = {};
document.querySelector(".start-btn").addEventListener("click", startQuiz);

function startTimer() {
  timer = setInterval(() => {
    if (timeLeft > 0) {
      timeLeft--;
      sessionStorage.setItem("timeLeft", timeLeft);
      editTime();
    } else {
      clearInterval(timer);
      window.location.href = "../TimeOut/timeOut.html";
    }
  }, 1000);
}

function startQuiz() {
  // sessionStorage.removeItem("timeLeft");
  const storedTime = sessionStorage.getItem("timeLeft");
  if (storedTime) {
    timeLeft = parseInt(storedTime);
  } else {
    timeLeft = 300;
  }
  editTime();
  document.querySelector(".container").classList.add("bg-blue");
  // document.querySelector(".container").classList.remove("container");
  // document.querySelector("container").style.display = "none";
  document.querySelector(".card").style.display = "none";
  document.getElementById("quiz-container").style.display = "block";
  document.getElementById("quiz-flag").style.display = "block";
  fetchQuestions();
  startTimer();
  loadFlaggedQuestions();
}

function editTime() {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timerElement = document.getElementById("timer");
  timerElement.textContent = `Time Left: ${minutes}:${
    seconds < 10 ? "0" : ""
  }${seconds}`;
}
const shuffle = (array) => array.sort(() => Math.random() - 0.5);

async function fetchQuestions() {
  try {
    showLoading();
    const response = await fetch("../file.json");
    const data = await response.json();

    if (!data || data.length === 0) {
      document.getElementById("empty-data-animate").style.display = "block"; 
      document.getElementById("no-data-text").style.display = "block";
      document.getElementById("quiz-container").style.display = "none";  
      document.getElementById("quiz-flag").style.display = "none";  
      clearInterval(timer);
      hideLoading();
      return;
    }

    console.log(data);
    setTimeout(() => {
      questions = data.map((q) => {
        let answers = q.options.map(
          (option, index) => new Answer(option, index === q.answer)
        );
        return new Question(q.question, answers);
      });

      questions = shuffle(questions);
      loadQuestion();
      updateNavigationButtons();
      loadFlaggedQuestions();

      hideLoading();
    }, 1000);
  } catch (error) {
    console.error("Error fetching questions:", error);
    clearInterval(timer);
    document.getElementById("imgError").style.display = "block";
    document.getElementById("quiz-container").style.display = "none";
    document.getElementById("quiz-flag").style.display = "none";
    hideLoading();
  }
} 

function showLoading() {
  document.getElementById("loading").style.display = "block";
}

function hideLoading() {
  document.getElementById("loading").style.display = "none";
}

let x = 0;

function loadQuestion() {
  const questionObj = questions[currentQuestionIndex];
  document.getElementById("question").textContent = questionObj.question;
  const optionsContainer = document.getElementById("options");
  optionsContainer.innerHTML = "";

  questionObj.answers.forEach((answer) => {
    const button = document.createElement("button");
    button.textContent = answer.text;
    button.className = "option-btn";

    const savedAnswer = sessionStorage.getItem(
      `answer-${questionObj.question}`
    );
    if (savedAnswer === answer.text) {
      button.classList.add("selected");
    }

    button.onclick = () => {
      sessionStorage.setItem(`answer-${questionObj.question}`, answer.text);
      document
        .querySelectorAll(".option-btn")
        .forEach((btn) => btn.classList.remove("selected"));
      button.classList.add("selected");
    };

    optionsContainer.appendChild(button);
  });

  checkFlagQustion();
  updateQuestionNumber();
}

function loadFlaggedQuestions() {
  showMarkedFlag.innerHTML = "";
  for (let i = 0; i < questions.length; i++) {
    if (sessionStorage.getItem("flaggedQuestion : " + i) === "true") {
      const questionDiv = document.createElement("div");
      questionDiv.classList.add("flagged-question");

      questionDiv.innerHTML = `<p id="get-question">${questions[i].question}</p>`;

      const deleteBtn = document.createElement("img");
      deleteBtn.src = "../assets/delete.png";
      deleteBtn.alt = "Delete";
      deleteBtn.classList.add("delete-button");

      questionDiv.appendChild(deleteBtn);

      showMarkedFlag.appendChild(questionDiv);

      questionDiv.addEventListener("click", function () {
        currentQuestionIndex = i;
        loadQuestion();
        updateNavigationButtons();
      });
      deleteBtn.addEventListener("click", function (event) {
        event.stopPropagation();
        sessionStorage.removeItem("flaggedQuestion : " + i);
        loadFlaggedQuestions();
        checkFlagQustion();

        imgFlag.src = "../assets/flag.png";
        imgFlag.style.height = "50px";
      });

      questionDiv.classList.add("flagged-question-flex");
    }
  }
}

function nextQuestion() {
  if (currentQuestionIndex < questions.length - 1) {
    currentQuestionIndex++;
    resetFlag();
    loadQuestion();
    updateNavigationButtons();
    checkFlagQustion();
    updateQuestionNumber();
  }
}

function prevQuestion() {
  if (currentQuestionIndex > 0) {
    currentQuestionIndex--;
    resetFlag();
    loadQuestion();
    updateNavigationButtons();
    checkFlagQustion();
    updateQuestionNumber();
  }
}

function checkFlagQustion() {
  if (
    sessionStorage.getItem("flaggedQuestion : " + currentQuestionIndex) ===
    "true"
  ) {
    markedFlag = true;
    imgFlag.src = "../assets/flagdone.png";
    imgFlag.style.height = "50px";
  }
}

//   if (!markedFlag) {
//     markedFlag = !markedFlag;
//     imgFlag.src = "../assets/flagdone.png";
//     imgFlag.style.height = "50px";

//     const questionDiv = document.createElement("div");
//     questionDiv.classList.add("flagged-question");
//     questionDiv.innerHTML = `<p id="get-question">${questions[currentQuestionIndex].question}</p>`;
//     showMarkedFlag.appendChild(questionDiv);

//     sessionStorage.setItem("flaggedQuestion : " + currentQuestionIndex, "true");

//     questionDiv.addEventListener("click", function() {
//       currentQuestionIndex = questions.findIndex(q => q.question === questionDiv.querySelector('#get-question').textContent);
//       loadQuestion();
//       updateNavigationButtons();
//     });
//   } else {
//     markedFlag = !markedFlag;
//     imgFlag.src = "../assets/flag.png";
//     imgFlag.style.height = "50px";
//     showMarkedFlag.removeChild(showMarkedFlag.lastChild);
//     sessionStorage.removeItem("flaggedQuestion : " + currentQuestionIndex);
//   }
// });

flag.addEventListener("click", function () {
  if (!markedFlag) {
    markedFlag = !markedFlag;
    imgFlag.src = "../assets/flagdone.png";
    imgFlag.style.height = "50px";

    const questionDiv = document.createElement("div");
    questionDiv.classList.add("flagged-question");
    questionDiv.innerHTML = `<p id="get-question">${questions[currentQuestionIndex].question}</p>`;

    const deleteBtn = document.createElement("img");
    deleteBtn.src = "../assets/delete.png";
    deleteBtn.alt = "Delete";
    deleteBtn.classList.add("delete-button");

    questionDiv.appendChild(deleteBtn);

    showMarkedFlag.appendChild(questionDiv);

    sessionStorage.setItem("flaggedQuestion : " + currentQuestionIndex, "true");

    loadFlaggedQuestions();

    deleteBtn.addEventListener("click", function (event) {
      event.stopPropagation();
      sessionStorage.removeItem("flaggedQuestion : " + currentQuestionIndex);
      loadFlaggedQuestions();
      checkFlagQustion();
    });
  } else {
    markedFlag = !markedFlag;
    imgFlag.src = "../assets/flag.png";
    imgFlag.style.height = "50px";
    showMarkedFlag.removeChild(showMarkedFlag.lastChild);
    sessionStorage.removeItem("flaggedQuestion : " + currentQuestionIndex);
  }
});

function updateNavigationButtons() {
  document.getElementById("prev-btn").disabled = currentQuestionIndex === 0;
  document.getElementById("next-btn").style.display =
    currentQuestionIndex === questions.length - 1 ? "none" : "inline";
  document.getElementById("submit-btn").style.display =
    currentQuestionIndex === questions.length - 1 ? "inline" : "none";
}

function submitQuiz() {
  sessionStorage.setItem("quizScore", score);
  sessionStorage.setItem("totalQuestions", totalQuestions);
  sessionStorage.setItem("passingScore", passingScore);
  score = 0;
  questions.forEach((question) => {
    const savedAnswer = sessionStorage.getItem(`answer-${question.question}`);
    if (
      question.answers.find((ans) => ans.isCorrect && ans.text === savedAnswer)
    ) {
      score++;
    }
  });
  sessionStorage.setItem("yourfinalscore", score);
  window.location.href = "../result/result.html";
}

function resetFlag() {
  markedFlag = false;
  imgFlag.src = "../assets/flag.png";
  imgFlag.style.height = "50px";
}

function updateQuestionNumber() {
  const questionNumberElement = document.getElementById("question-number");
  questionNumberElement.textContent = `${currentQuestionIndex + 1} of ${
    questions.length
  } Questions`;
}
