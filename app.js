// ---------- DEFAULT USERS ----------
if (!localStorage.getItem("users")) {
    const defaultUsers = {
        A001: { role: "admin", pass: null },
        F001: { role: "faculty", pass: null }
    };

    localStorage.setItem("users", JSON.stringify(defaultUsers));
    setInitialPasswords();
}

// ---------- HASH FUNCTION ----------
async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hash = await crypto.subtle.digest("SHA-256", data);
    return Array.from(new Uint8Array(hash))
        .map(b => b.toString(16).padStart(2, "0"))
        .join("");
}

// ---------- SET INITIAL PASSWORDS ----------
async function setInitialPasswords() {
    let users = JSON.parse(localStorage.getItem("users"));
    users["A001"].pass = await hashPassword("admin123");
    users["F001"].pass = await hashPassword("faculty123");
    localStorage.setItem("users", JSON.stringify(users));
}

// ---------- LOGIN ----------
async function login() {
    const id = document.getElementById("userid").value.trim();
    const pass = document.getElementById("password").value;

    const users = JSON.parse(localStorage.getItem("users"));
    if (!users[id]) return alert("User not found");

    const hashed = await hashPassword(pass);

    if (users[id].pass === hashed) {
        localStorage.setItem("user", id);
        localStorage.setItem("role", users[id].role);
        window.location = "dashboard.html";
    } else {
        alert("Invalid credentials");
    }
}

function togglePass() {
    const p = document.getElementById("password");
    p.type = p.type === "password" ? "text" : "password";
}
