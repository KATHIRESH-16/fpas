"use strict";

// USERS
const users = [
  { id: "A001", name: "Admin", pass: "admin", role: "admin" },
  { id: "F001", name: "Kathiresh", pass: "1234", role: "faculty" },
  { id: "F002", name: "Arun", pass: "1234", role: "faculty" }
];

// LOGIN
function login() {
  const id = fid.value;
  const pwdVal = pwd.value;
  const roleVal = role.value;

  const user = users.find(
    u => u.id === id && u.pass === pwdVal && u.role === roleVal
  );

  if (!user) return alert("Invalid login");

  localStorage.setItem("user", JSON.stringify(user));
  showDashboard();
}

// LOGOUT
function logout() {
  localStorage.clear();
  location.reload();
}

// DASHBOARD
function showDashboard() {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) return;

  loginBox.classList.add("hidden");
  dashboard.classList.remove("hidden");
  userName.innerText = user.name;

  if (user.role === "admin") {
    adminPanel.classList.remove("hidden");
    facultyPanel.classList.add("hidden");
  } else {
    facultyPanel.classList.remove("hidden");
    adminPanel.classList.add("hidden");
    loadPeriods();
  }
}

// PERIOD CRUD
function addPeriod() {
  const user = JSON.parse(localStorage.getItem("user"));
  const periods = JSON.parse(localStorage.getItem("periods") || "[]");

  periods.push({
    id: Date.now(),
    faculty: user.id,
    subject: subject.value,
    time: time.value
  });

  localStorage.setItem("periods", JSON.stringify(periods));
  loadPeriods();
}

function deletePeriod(id) {
  let periods = JSON.parse(localStorage.getItem("periods"));
  periods = periods.filter(p => p.id !== id);
  localStorage.setItem("periods", JSON.stringify(periods));
  loadPeriods();
}

function loadPeriods() {
  const user = JSON.parse(localStorage.getItem("user"));
  const periods = JSON.parse(localStorage.getItem("periods") || "[]");

  periodList.innerHTML = "";
  periods
    .filter(p => p.faculty === user.id)
    .forEach(p => {
      const div = document.createElement("div");
      div.className = "period";
      div.innerHTML = `
        <b>${p.subject}</b> – ${p.time}
        <button onclick="deletePeriod(${p.id})">❌</button>
      `;
      periodList.appendChild(div);
    });
}

// REAL-TIME ALERT (DEMO)
setInterval(() => {
  const now = new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'});
  const periods = JSON.parse(localStorage.getItem("periods") || "[]");
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) return;

  periods.forEach(p => {
    if (p.faculty === user.id && p.time === now) {
      if (Notification.permission === "granted") {
        new Notification("FPAS Alert", { body: p.subject + " is starting now" });
      }
    }
  });
}, 60000);

// THEME
function toggleTheme() {
  document.body.classList.toggle("light");
}

// AUTO LOGIN
Notification.requestPermission();
showDashboard();
