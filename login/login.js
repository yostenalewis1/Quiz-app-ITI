const loginForm = document.getElementById("login-form");
const emailInput = document.getElementById("login-email");
const passwordInput = document.getElementById("login-password");
const errorMessage = document.getElementById("login-error-message");

document.addEventListener("DOMContentLoaded", function () {
  if (localStorage.getItem("loggedIn") === "true") {
    window.location.href = "../start/start.html";
  }
});
loginForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const users = JSON.parse(localStorage.getItem("users"))|| [];
  let loggedIn = false;   

  users.forEach((user) => {
    if (
      user.email === emailInput.value &&
      user.password === passwordInput.value
    ) {
      loggedIn = true;
      localStorage.setItem("loggedIn", "true");
      localStorage.setItem("currentUserEmail", user.email);
      localStorage.setItem("currentUserName", user.userName);
      window.location.href = "../start/start.html";
    }
  });
 
  if (!loggedIn) {
    errorMessage.style.display = "block";
    errorMessage.textContent = "Invalid email or password.";
  } 
});

