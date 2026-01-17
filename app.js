/* ---------- USERS SETUP ---------- */
// Only initialize if users don't exist to prevent overwriting custom data
if (!localStorage.getItem("users")) {
    const initialUsers = {
        A001: { role: "admin", pass: "admin123" },
        A002: { role: "admin", pass: "admin123" },
        F001: { role: "faculty", pass: "faculty123" },
        F002: { role: "faculty", pass: "faculty123" }
    };
    localStorage.setItem("users", JSON.stringify(initialUsers));
}

/* ---------- CAPTCHA LOGIC ---------- */
let captchaAnswer;

function generateCaptcha() {
    const a = Math.floor(Math.random() * 10) + 1;
    const b = Math.floor(Math.random() * 10) + 1;
    const operators = ['+', '-', '*'];
    const op = operators[Math.floor(Math.random() * 3)];

    let displayA = a;
    let displayB = b;

    if (op === '-') {
        // Ensure no negative results
        if (a < b) {
            displayA = b;
            displayB = a;
        }
        captchaAnswer = displayA - displayB;
    } else if (op === '+') {
        captchaAnswer = a + b;
    } else {
        captchaAnswer = a * b;
    }

    document.getElementById("capText").innerText = `${displayA} ${op} ${displayB} = ?`;
    document.getElementById("captchaInput").value = ""; // Clear old answer
}

/* ---------- PASSWORD TOGGLE ---------- */
function togglePass() {
    const p = document.getElementById("password");
    const eye = document.getElementById("toggleBtn");
    if (p.type === "password") {
        p.type = "text";
        eye.innerText = "🔒"; // Optional: Change icon when visible
    } else {
        p.type = "password";
        eye.innerText = "👁";
    }
}

/* ---------- LOGIN LOGIC ---------- */
function login() {
    const id = document.getElementById("userid").value.trim();
    const pass = document.getElementById("password").value;
    const role = document.getElementById("role").value;
    const capValue = document.getElementById("captchaInput").value;

    // 1. Check if fields are empty
    if (!id || !pass || capValue === "") {
        alert("Please fill all fields");
        return;
    }

    // 2. Validate Captcha
    if (parseInt(capValue) !== captchaAnswer) {
        alert("Captcha incorrect!");
        generateCaptcha();
        return;
    }

    // 3. Validate Credentials
    const allUsers = JSON.parse(localStorage.getItem("users"));
    const user = allUsers[id];

    if (user && user.pass === pass && user.role === role) {
        localStorage.setItem("currentUser", id);
        localStorage.setItem("currentRole", role);
        alert("Login Successful!");
        window.location.href = "dashboard.html";
    } else {
        alert("Invalid User ID, Password, or Role");
        generateCaptcha();
    }
}

/* ---------- INITIALIZATION ---------- */
document.addEventListener("DOMContentLoaded", () => {
    generateCaptcha();

    // Attach toggle event
    const eye = document.getElementById("toggleBtn");
    if (eye) {
        eye.addEventListener("click", togglePass);
    }
});

/* ---------- SERVICE WORKER ---------- */
if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("service-worker.js")
        .catch(err => console.log("SW Registration Failed", err));
}
