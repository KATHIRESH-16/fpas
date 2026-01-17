const content = document.getElementById("content");
const user = localStorage.getItem("user");
const role = localStorage.getItem("role");

let users = JSON.parse(localStorage.getItem("users"));
let periods = JSON.parse(localStorage.getItem("periods") || "[]");

/* ---------- DASHBOARD ---------- */
function showDashboard() {
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
    const todayPeriods = periods.filter(p => p.faculty === user && p.day === today);

    content.innerHTML = `
      <h1>Welcome ${user}</h1>
      <div class="cards">
        <div class="card">Role<br><b>${role}</b></div>
        <div class="card">Today<br><b>${today}</b></div>
        <div class="card">Periods Today<br><b>${todayPeriods.length}</b></div>
      </div>
    `;

    if(role === "faculty") startAlerts(todayPeriods);
}

/* ---------- TIMETABLE ---------- */
function showTimetable() {
    const data = role === "admin" ? periods : periods.filter(p => p.faculty === user);
    content.innerHTML = `
      <h2>Weekly Timetable</h2>
      <table class="timetable">
        <tr>
          <th>Faculty</th><th>Day</th><th>Period</th><th>Class</th><th>Time</th><th>Reminder</th>
          ${role === "admin" ? '<th>Actions</th>' : ''}
        </tr>
        ${data.map((p,i)=>`
          <tr>
            <td>${p.faculty}</td><td>${p.day}</td><td>${p.period}</td>
            <td>${p.class}</td><td>${p.time}</td><td>${p.rem} min</td>
            ${role==="admin"?`<td><button onclick="editPeriod(${i})">✏️</button> <button onclick="deletePeriod(${i})">❌</button></td>`:''}
          </tr>`).join('')}
      </table>
    `;
}

/* ---------- ADMIN PANEL ---------- */
function showAdminPanel() {
    if(role !== "admin") return alert("Admin only");
    const facList = Object.keys(users).filter(u => users[u].role === "faculty");
    content.innerHTML = `
      <h2>Create / Edit Period</h2>
      <div class="form">
        <select id="fac" multiple>
          ${facList.map(f => `<option>${f}</option>`).join('')}
        </select>
        <select id="day">
          <option>Monday</option><option>Tuesday</option><option>Wednesday</option>
          <option>Thursday</option><option>Friday</option><option>Saturday</option><option>Sunday</option>
        </select>
        <input id="period" placeholder="Period Name">
        <input id="className" placeholder="Class Name">
        <input type="time" id="time">
        <input type="number" id="rem" placeholder="Reminder Minutes">
        <button onclick="addPeriod()">Add Period</button>
      </div>
    `;
}

/* ---------- ADD / EDIT / DELETE ---------- */
function addPeriod() {
    const facs = Array.from(document.getElementById("fac").selectedOptions).map(o => o.value);
    const day = document.getElementById("day").value;
    const periodName = document.getElementById("period").value;
    const className = document.getElementById("className").value;
    const time = document.getElementById("time").value;
    const rem = document.getElementById("rem").value;

    facs.forEach(f => periods.push({faculty: f, day, period: periodName, class: className, time, rem}));
    localStorage.setItem("periods", JSON.stringify(periods));
    showTimetable();
}

function editPeriod(i) {
    const p = periods[i];
    const newPeriod = prompt("Period Name", p.period);
    if(!newPeriod) return;
    p.period = newPeriod;
    localStorage.setItem("periods", JSON.stringify(periods));
    showTimetable();
}

function deletePeriod(i) {
    if(confirm("Delete this period?")) {
        periods.splice(i,1);
        localStorage.setItem("periods", JSON.stringify(periods));
        showTimetable();
    }
}

/* ---------- USER MANAGEMENT ---------- */
function showUserPanel() {
    if(role !== "admin") return alert("Admin only");
    content.innerHTML = `
      <h2>Create User</h2>
      <input id="uid" placeholder="User ID">
      <input id="upass" placeholder="Password">
      <select id="urole">
        <option value="faculty">Faculty</option>
        <option value="admin">Admin</option>
      </select>
      <button onclick="createUser()">Create User</button>
    `;
}

function createUser() {
    const id = document.getElementById("uid").value.trim();
    const pass = document.getElementById("upass").value;
    const urole = document.getElementById("urole").value;

    if(!id || !pass) return alert("Fill all fields");
    users[id] = {role: urole, pass};
    localStorage.setItem("users", JSON.stringify(users));
    alert("User created");
}

/* ---------- ALERTS ---------- */
function startAlerts(todayPeriods){
    todayPeriods.forEach(p => {
        const [hour, min] = p.time.split(":").map(Number);
        const alertTime = new Date();
        alertTime.setHours(hour);
        alertTime.setMinutes(min - Number(p.rem));
        alertTime.setSeconds(0);
        const delay = alertTime - new Date();
        if(delay>0) setTimeout(() => alert(`Reminder: ${p.period} (${p.class}) starts in ${p.rem} min`), delay);
    });
}

/* ---------- LOGOUT / PDF ---------- */
function exportPDF(){ window.print(); }
function logout(){ localStorage.clear(); location.href="index.html"; }

/* ---------- INIT ---------- */
showDashboard();
