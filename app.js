/* ---------- USERS ---------- */
let users = JSON.parse(localStorage.getItem("users")) || {
  A001:{role:"admin",pass:"admin123"},
  A002:{role:"admin",pass:"admin123"},
  A003:{role:"admin",pass:"admin123"},
  F001:{role:"faculty",pass:"faculty123"},
  F002:{role:"faculty",pass:"faculty123"},
  F003:{role:"faculty",pass:"faculty123"},
  F004:{role:"faculty",pass:"faculty123"},
  F005:{role:"faculty",pass:"faculty123"},
  F006:{role:"faculty",pass:"faculty123"},
  F007:{role:"faculty",pass:"faculty123"}
};
localStorage.setItem("users", JSON.stringify(users));

/* ---------- CAPTCHA ---------- */
let a, b, op, captchaAnswer;

function generateCaptcha() {
  a = Math.floor(Math.random() * 10) + 1; // 1-10
  b = Math.floor(Math.random() * 10) + 1; // 1-10
  const operators = ['+', '-', '*'];
  op = operators[Math.floor(Math.random() * 3)];

  // Ensure subtraction is never negative
  if(op === '-') {
    if(a < b) [a, b] = [b, a]; // swap to avoid negative
    captchaAnswer = a - b;
  } else if(op === '+') {
    captchaAnswer = a + b;
  } else { // multiplication
    captchaAnswer = a * b;
  }

  document.getElementById("capText").innerText = `${a} ${op} ${b} = ?`;
}

/* ---------- PASSWORD TOGGLE ---------- */
function togglePass() {
  const p = document.getElementById("password");
  p.type = p.type === "password" ? "text" : "password";
}

/* ---------- LOGIN ---------- */
function login() {
  const id = document.getElementById("userid").value;
  const pass = document.getElementById("password").value;
  const role = document.getElementById("role").value;
  const cap = parseInt(document.getElementById("captcha").value);

  if(cap !== captchaAnswer) {
    alert("Captcha incorrect");
    generateCaptcha(); // regenerate if wrong
    return;
  }

  const user = JSON.parse(localStorage.getItem("users"))[id];
  if(user && user.pass === pass && user.role === role) {
    localStorage.setItem("user", id);
    localStorage.setItem("role", role);
    location.href = "dashboard.html";
  } else {
    alert("Invalid credentials");
    generateCaptcha(); // regenerate if login fails
  }
}

/* ---------- INITIALIZATION ---------- */
window.addEventListener("DOMContentLoaded", () => {
  generateCaptcha(); // show captcha on page load

  // Attach togglePass to eye icon
  const eye = document.querySelector(".pass-box span");
  if(eye) eye.addEventListener("click", togglePass);
});

/* ---------- SERVICE WORKER ---------- */
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("service-worker.js")
    .then(reg => console.log("Service Worker Registered", reg))
    .catch(err => console.log("SW Registration Failed", err));
}
