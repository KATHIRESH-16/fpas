"use strict";

// USERS
const users = [
  { id: "A001", name: "Admin", pass: "admin", role: "admin" },
  { id: "F001", name: "Kathiresh", pass: "1234", role: "faculty" },
  { id: "F002", name: "Arun", pass: "1234", role: "faculty" }
];

// LOGIN
function login() {
  const id = document.getElementById("fid").value;
  const pwdVal = document.getElementById("pwd").value;
  const roleVal = document.getElementById("role").value;

  const user = users.find(u => u.id === id && u.pass === pwdVal && u.role === roleVal);
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

  document.getElementById("loginPage").classList.add("hidden");
  document.getElementById("dashboardPage").classList.remove("hidden");
  document.getElementById("userName").innerText = user.name;

  if(user.role === "admin") {
    document.getElementById("adminMenu").classList.remove("hidden");
    document.getElementById("facultyPanel").classList.add("hidden");
  } else {
    document.getElementById("facultyPanel").classList.remove("hidden");
    loadPeriods();
  }

  loadAdminTable();
  loadTodayOverview();
}

// SECTION SWITCH
function showSection(id) {
  document.querySelectorAll(".section").forEach(s => s.classList.add("hidden"));
  document.getElementById(id).classList.remove("hidden");
}

// PERIOD CRUD
function addPeriod() {
  const user = JSON.parse(localStorage.getItem("user"));
  const periods = JSON.parse(localStorage.getItem("periods") || "[]");
  const subject = document.getElementById("subject").value;
  const time = document.getElementById("time").value;

  if(!subject || !time) return alert("Enter subject & time");

  periods.push({ id: Date.now(), faculty: user.id, subject, time });
  localStorage.setItem("periods", JSON.stringify(periods));
  document.getElementById("subject").value="";
  document.getElementById("time").value="";
  loadPeriods();
  loadTodayOverview();
}

function deletePeriod(id) {
  let periods = JSON.parse(localStorage.getItem("periods") || "[]");
  periods = periods.filter(p => p.id !== id);
  localStorage.setItem("periods", JSON.stringify(periods));
  loadPeriods();
  loadTodayOverview();
}

function loadPeriods() {
  const user = JSON.parse(localStorage.getItem("user"));
  const periods = JSON.parse(localStorage.getItem("periods") || "[]");
  const container = document.getElementById("periodList");
  container.innerHTML = "";
  periods.filter(p => p.faculty === user.id)
         .forEach(p => {
           const div = document.createElement("div");
           div.className = "period-card";
           div.innerHTML = `<span>${p.subject} - ${p.time}</span>
                            <button onclick="deletePeriod(${p.id})">❌</button>`;
           container.appendChild(div);
         });
}

// ADMIN TABLE
function loadAdminTable() {
  const tbody = document.querySelector("#adminTable tbody");
  tbody.innerHTML = "";
  users.forEach(u => {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td>${u.id}</td><td>${u.name}</td><td>${u.role}</td><td>-</td>`;
    tbody.appendChild(tr);
  });
}

// TODAY OVERVIEW
function loadTodayOverview() {
  const user = JSON.parse(localStorage.getItem("user"));
  const periods = JSON.parse(localStorage.getItem("periods") || "[]");
  const container = document.getElementById("todayPeriods");
  container.innerHTML = "";
  periods.filter(p => p.faculty === user.id).forEach(p => {
    const div = document.createElement("div");
    div.className = "period-card";
    div.innerHTML = `<span>${p.subject} - ${p.time}</span>`;
    container.appendChild(div);
  });
}

// REAL-TIME ALERT
setInterval(() => {
  const now = new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'});
  const user = JSON.parse(localStorage.getItem("user"));
  if(!user) return;
  const periods = JSON.parse(localStorage.getItem("periods") || "[]");
  periods.filter(p => p.faculty === user.id && p.time === now)
         .forEach(p => {
           if(Notification.permission === "granted"){
             new Notification("FPAS Alert", { body: `${p.subject} is starting now`});
           }
         });
}, 60000);

// THEME TOGGLE
function toggleTheme() { document.body.classList.toggle("light"); }

// INIT
Notification.requestPermission();
showDashboard();
