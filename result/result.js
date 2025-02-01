const score = parseInt(sessionStorage.getItem("yourfinalscore"), 10);
const totalQuestions = parseInt(sessionStorage.getItem("totalQuestions"), 10);
const passingScore = parseInt(sessionStorage.getItem("passingScore"), 10);

const scoreElement = document.getElementById("score");
const resultMessageElement = document.getElementById("result-message");

const currentUserName = localStorage.getItem("currentUserName");

scoreElement.textContent = `${score} / ${totalQuestions}`;

if (score >= passingScore) {
  resultMessageElement.textContent = `Congratulations ${currentUserName}, You passed the quiz!`;
  document.getElementsByTagName("img")[0].src = "../assets/Bird Success.gif";
  document.getElementsByTagName("img")[0].style.width="30%"
  resultMessageElement.style.color = "green";
} else {
  resultMessageElement.textContent = `Sorry, ${currentUserName} didn't pass. Try again!`;
  document.getElementsByTagName("img")[0].src = "../assets/fail.gif";
  document.getElementsByTagName("img")[0].style.width="30%"
  resultMessageElement.style.color = "red";
}

function retryQuiz() {
  window.location.href = "../start/start.html";
  sessionStorage.clear();
}

function logOut() {
  localStorage.removeItem("loggedIn");
  localStorage.removeItem("currentUserEmail");
  localStorage.removeItem("currentUserName");
  window.location.href = "../index.html";
}
