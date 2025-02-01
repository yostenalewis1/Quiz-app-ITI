var fname = document.getElementById("first-name");
var lname = document.getElementById("last-name");
var email = document.getElementById("signup-email");
var password = document.getElementById("signup-password");
var confirmpassword = document.getElementById("confirm-password");
var firstnameError = document.getElementById("fname-error");
var lastnameError = document.getElementById("lname-error");
var emailError = document.getElementById("email-error");
var passwordError = document.getElementById("password-error");
var confirmpasswordError = document.getElementById("re-password-error");
const signupForm = document.getElementById("signup-form");

var regEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
var regPassword =
  /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;

  document.addEventListener("DOMContentLoaded", function () {
    if (sessionStorage.getItem("Signedup") === "true") {
      window.location.href = "../login/login.html";   
    }
  });
  

function checkFirstName() {
  if (fname.value == "" || !isNaN(fname.value)) {
    firstnameError.style.visibility = "visible";
    return false;
  } else {
    firstnameError.style.visibility = "hidden";
    return true;
  }
}

function checkLastName() {
  if (lname.value == "" || !isNaN(lname.value)) {
    lastnameError.style.visibility = "visible";
    return false;
  } else {
    lastnameError.style.visibility = "hidden";
    return true;
  }
}

function checkEmail() {
  var returnData = localStorage.getItem("users");

  if (!regEmail.test(email.value)) {
    emailError.style.visibility = "visible";
    return false;
  } else {
    emailError.style.visibility = "hidden";

    if (returnData) { 
      let users = JSON.parse(returnData);
      for (let i = 0; i < users.length; i++) {
        if (users[i].email === email.value) {
          emailError.style.visibility = "visible";
          emailError.innerHTML = "Email already exists";
          return false;
        }
      }
    }
    return true;
  }
}

function checkPassword() {
  if (!regPassword.test(password.value)) {
    passwordError.style.visibility = "visible";
    return false;
  } else {
    passwordError.style.visibility = "hidden";
    return true;
  }
}

function checkConfirmPassword() {
  if (confirmpassword.value !== password.value) {
    confirmpasswordError.style.visibility = "visible";
    return false;
  } else {
    confirmpasswordError.style.visibility = "hidden";
    return true;
  }
}

function check()
{
  if (checkFirstName() && checkLastName() && checkEmail() && checkPassword() && checkConfirmPassword())
  {
    return true;
  }
  else
  {
    return false;
  }
}
 

signupForm.addEventListener("submit", function (e) {
  e.preventDefault();

  if (check()) {
    
    const newUser = {
      userName: fname.value + " " + lname.value,
      email: email.value,
      password: password.value,
    };
    
    let users = JSON.parse(localStorage.getItem("users")) || [];
    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));
    
    sessionStorage.setItem("Signedup", "true");
    window.location.href = "../login/login.html";
  }
});