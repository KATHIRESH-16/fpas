/* ---------- SAFE INITIALIZATION ---------- */
const content = document.getElementById("content");

let user = localStorage.getItem("user") || "F001";
let role = localStorage.getItem("role") || "faculty";

/* Default users */
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
  F007:{role:"faculty",pass:"faculty123"},
};
localStorage.setItem("users", JSON.stringify(users));

/* Period storage */
let periods = JSON.parse(localStorage.getItem("periods")) || [];
localStorage.setItem("periods", JSON.stringify(periods));

/* ---------- DASHBOARD ---------- */
function showDashboard() {
  const today = new Date().toLocaleDateString("en-US", { weekday: "long" });
  const todayPeriods = periods.filter(
    p => p.faculty === user && p.day === today
  );

  content.innerHTML = `
    <h1>Welcome ${user}</h1>
    <div class="cards">
      <div class="card">Role<br><b>${role}</b></div>
      <div class="card">Today<br><b>${today}</b></div>
      <div class="card">Today Periods<br><b>${todayPeriods.length}</b></div>
    </div>
  `;
}

/* ---------- TIMETABLE ---------- */
function showTimetable() {
  const data = role === "admin"
    ? periods
    : periods.filter(p => p.faculty === user);

  content.innerHTML = `
    <h2>Weekly Timetable</h2>
    <table class="timetable">
      <tr>
        <th>Faculty</th>
        <th>Day</th>
        <th>Period</th>
        <th>Class</th>
        <th>Start Time</th>
        <th>Reminder</th>
      </tr>
      ${data.map(p => `
        <tr>
          <td>${p.faculty}</td>
          <td>${p.day}</td>
          <td>${p.period}</td>
          <td>${p.class}</td>
          <td>${p.time}</td>
          <td>${p.rem} min</td>
        </tr>
      `).join("")}
    </table>
  `;
}

/* ---------- ADMIN PANEL ---------- */
function showAdmin() {
  if (role !== "admin") {
    content.innerHTML = `<h2>Admin access only</h2>`;
    return;
  }

  const facultyList = Object.keys(users).filter(u => u.startsWith("F"));

  content.innerHTML = `
    <h2>Create Timetable</h2>

    <div class="form">
      <select id="fac">
        <option value="ALL">All Faculty</option>
        ${facultyList.map(f => `<option>${f}</option>`).join("")}
      </select>

      <select id="day">
        <option>Monday</option><option>Tuesday</option><option>Wednesday</option>
        <option>Thursday</option><option>Friday</option>
        <option>Saturday</option><option>Sunday</option>
      </select>

      <input id="period" placeholder="Period Name">
      <input id="className" placeholder="Class Name">
      <input type="time" id="time">
      <input type="number" id="rem" placeholder="Reminder (min)">

      <button onclick="addPeriod()">Add Period</button>
    </div>
  `;
}

/* ---------- ADD PERIOD ---------- */
function addPeriod() {
  const fac = document.getElementById("fac").value;
  const day = document.getElementById("day").value;

  const p = {
    period: period.value,
    class: className.value,
    time: time.value,
    rem: rem.value
  };

  if (fac === "ALL") {
    Object.keys(users)
      .filter(u => u.startsWith("F"))
      .forEach(f => periods.push({ ...p, faculty: f, day }));
  } else {
    periods.push({ ...p, faculty: fac, day });
  }

  localStorage.setItem("periods", JSON.stringify(periods));
  showTimetable();
}

/* ---------- LOGOUT ---------- */
function logout() {
  localStorage.clear();
  location.href = "index.html";
}

/* Load dashboard by default */
showDashboard();
