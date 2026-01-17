/* ---------- INITIAL USERS ---------- */
if (!localStorage.getItem("users")) {
    const initialUsers = {
        // Admins
        A001: { role: "admin", pass: "admin123" },
        A002: { role: "admin", pass: "admin123" },
        A003: { role: "admin", pass: "admin123" },
        // Faculty
        F001: { role: "faculty", pass: "faculty123" },
        F002: { role: "faculty", pass: "faculty123" },
        F003: { role: "faculty", pass: "faculty123" },
        F004: { role: "faculty", pass: "faculty123" },
        F005: { role: "faculty", pass: "faculty123" },
        F006: { role: "faculty", pass: "faculty123" },
        F007: { role: "faculty", pass: "faculty123" }
    };
    localStorage.setItem("users", JSON.stringify(initialUsers));
}

/* ---------- CAPTCHA ---------- */
let captchaAnswer;
function generateCaptcha() {
    let a = Math.floor(Math.random() * 10) + 1;
    let b = Math.floor(Math.random() * 10) + 1;
    const operators = ['+', '-', '*'];
    const op = operators[Math.floor(Math.random() * 3)];

    if(op === '-' && a < b) [a, b] = [b, a];

    captchaAnswer = op === '+' ? a+b : op==='-' ? a-b : a*b;
    document.getElementById("capText").innerText = `${a} ${op} ${b} = ?`;
    document.getElementById("captchaInput").value = "";
}

/* ---------- PASSWORD TOGGLE ---------- */
function togglePass() {
    const p = document.getElementById("password");
    const eye = document.getElementById("toggleBtn");
    if (p.type === "password") {
        p.type = "text";
        eye.innerText = "🔒";
    } else {
        p.type = "password";
        eye.innerText = "👁";
    }
}

/* ---------- LOGIN ---------- */
function login() {
    const id = document.getElementById("userid").value.trim();
    const pass = document.getElementById("password").value;
    const cap = parseInt(document.getElementById("captchaInput").value);

    if (!id || !pass || isNaN(cap)) {
        alert("Please fill all fields");
        return;
    }

    if(cap !== captchaAnswer) {
        alert("Captcha incorrect!");
        generateCaptcha();
        return;
    }

    const allUsers = JSON.parse(localStorage.getItem("users"));
    const user = allUsers[id];

    if(user && user.pass === pass) {
        localStorage.setItem("user", id);
        localStorage.setItem("role", user.role);
        window.location.href = "dashboard.html";
    } else {
        alert("Invalid User ID or Password");
        generateCaptcha();
    }
}

/* ---------- INIT ---------- */
document.addEventListener("DOMContentLoaded", () => {
    generateCaptcha();
    const eye = document.getElementById("toggleBtn");
    if(eye) eye.addEventListener("click", togglePass);
});

/* ---------- SERVICE WORKER ---------- */
if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("service-worker.js")
        .catch(err => console.log("SW Registration Failed", err));
}
