"use strict";

// USERS & PERIODS
let users = JSON.parse(localStorage.getItem("users") || "[]");
if (!users || users.length === 0) {
    users = [
        { id: "A001", name: "Admin", pass: "admin", role: "admin" },
        { id: "F001", name: "Kathiresh", pass: "1234", role: "faculty" }
    ];
    localStorage.setItem("users", JSON.stringify(users));
}
let periods = JSON.parse(localStorage.getItem("periods") || "[]");

// LOGIN
function login() {
    const id = document.getElementById("fid").value.trim();
    const pwd = document.getElementById("pwd").value.trim();
    const role = document.getElementById("role").value;
    const user = users.find(u => u.id === id && u.pass === pwd && u.role === role);
    if (!user) return alert("Invalid login");
    localStorage.setItem("user", JSON.stringify(user));
    document.getElementById("loginPage").classList.add("hidden");
    document.getElementById("dashboardPage").classList.remove("hidden");
    showDashboard();
}

// LOGOUT
function logout() { localStorage.removeItem("user"); location.reload(); }

// DASHBOARD
function showDashboard() {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) return;
    document.getElementById("userName").innerText = user.name;
    if (user.role === "admin") {
        document.getElementById("adminMenu").classList.remove("hidden");
        document.getElementById("weeklyMenu").classList.remove("hidden");
    } else {
        document.getElementById("adminMenu").classList.add("hidden");
        document.getElementById("weeklyMenu").classList.add("hidden");
    }
    loadPeriods();
    loadAdminTable();
    loadTodayOverview();
    loadWeeklyCalendar();
}

// SECTION SWITCH
function showSection(id) {
    document.querySelectorAll(".section").forEach(s => s.classList.add("hidden"));
    document.getElementById(id).classList.remove("hidden");
}

// ADD FACULTY
function addFaculty() {
    const id = document.getElementById("newFid").value.trim();
    const name = document.getElementById("newName").value.trim();
    const pass = document.getElementById("newPass").value.trim();
    if (!id || !name || !pass) return alert("Fill all fields");
    if (users.find(u => u.id === id)) return alert("ID already exists");
    users.push({ id, name, pass, role: "faculty" });
    localStorage.setItem("users", JSON.stringify(users));
    loadAdminTable();
}

// ADD PERIOD
function addPeriod() {
    const subject = document.getElementById("subject").value.trim();
    const startTime = document.getElementById("startTime").value.trim();
    const endTime = document.getElementById("endTime").value.trim();
    const classroom = document.getElementById("classroom").value.trim();
    const assignTo = document.getElementById("assignTo").value;
    const facultyId = document.getElementById("facultyId").value.trim();
    if (!subject || !startTime || !endTime || !classroom) return alert("Fill all fields");

    if (assignTo === "single") {
        if (!facultyId) return alert("Enter Faculty ID");
        const faculty = users.find(u => u.id === facultyId && u.role === "faculty");
        if (!faculty) return alert("Invalid Faculty ID");
        periods.push({ id: Date.now(), faculty: facultyId, subject, startTime, endTime, classroom, color: getRandomColor() });
    } else {
        users.filter(u => u.role === "faculty").forEach(f => {
            periods.push({ id: Date.now() + Math.random(), faculty: f.id, subject, startTime, endTime, classroom, color: getRandomColor() });
        });
    }
    localStorage.setItem("periods", JSON.stringify(periods));
    resetCreatePeriod();
    loadPeriods();
    loadTodayOverview();
    loadWeeklyCalendar();
}

// DELETE PERIOD
function deletePeriod(id) {
    periods = periods.filter(p => p.id !== id);
    localStorage.setItem("periods", JSON.stringify(periods));
    loadPeriods();
    loadTodayOverview();
    loadWeeklyCalendar();
}

// LOAD PERIODS
function loadPeriods() {
    const user = JSON.parse(localStorage.getItem("user"));
    const container = document.getElementById("periodList");
    container.innerHTML = "";
    periods.filter(p => p.faculty === user.id)
        .forEach(p => {
            const div = document.createElement("div");
            div.className = "period-card";
            div.style.background = p.color;
            div.innerHTML = `<span><b>${p.subject}</b><small>${p.startTime}-${p.endTime}</small><small>${p.classroom}</small></span>
            <button onclick="deletePeriod(${p.id})">❌</button>`;
            container.appendChild(div);
        });
}

// TODAY OVERVIEW
function loadTodayOverview() {
    const user = JSON.parse(localStorage.getItem("user"));
    const container = document.getElementById("todayPeriods");
    container.innerHTML = "";
    periods.filter(p => p.faculty === user.id)
        .forEach(p => {
            const div = document.createElement("div");
            div.className = "period-card";
            div.style.background = p.color;
            div.innerHTML = `<span><b>${p.subject}</b><small>${p.startTime}-${p.endTime}</small></span>`;
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

// WEEKLY CALENDAR
function loadWeeklyCalendar() {
    const container = document.getElementById("weeklyCalendar");
    container.innerHTML = "";
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const user = JSON.parse(localStorage.getItem("user"));
    days.forEach(d => {
        const div = document.createElement("div");
        div.innerHTML = `<b>${d}</b><br>` +
            periods.filter(p => p.faculty === user.id)
                .map(p => `<div class="period-card" style="background:${p.color};margin-top:5px;">${p.subject}<br>${p.startTime}-${p.endTime}</div>`).join('');
        container.appendChild(div);
    });
}

// THEME TOGGLE
function toggleTheme() { document.body.classList.toggle("light"); }

// NOTIFICATIONS
setInterval(() => {
    const now = new Date();
    const time = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) return;
    periods.filter(p => p.faculty === user.id).forEach(p => {
        if (p.startTime === time || p.endTime === time) {
            if (Notification.permission === "granted")
                new Notification("FPAS Alert", { body: `${p.subject} ${p.startTime === time ? 'is starting' : 'has ended'}` });
        }
    });
}, 60000);

// UTILITIES
function resetCreatePeriod() {
    document.getElementById("subject").value = "";
    document.getElementById("startTime").value = "";
    document.getElementById("endTime").value = "";
    document.getElementById("classroom").value = "";
    document.getElementById("facultyId").value = "";
}
function getRandomColor() { const colors = ["#22c55e", "#3b82f6", "#f59e0b", "#f87171", "#8b5cf6", "#06b6d4"]; return colors[Math.floor(Math.random() * colors.length)]; }

// INIT
Notification.requestPermission();
