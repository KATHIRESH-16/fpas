const role = localStorage.getItem("role");
const user = localStorage.getItem("user");
const main = document.getElementById("main");

let periods = JSON.parse(localStorage.getItem("periods")) || [];

loadDashboard();

/* ---------- DASHBOARD ---------- */
function loadDashboard() {
  const today = new Date().toLocaleDateString("en-US", { weekday: "long" });

  const todayPeriods = periods.filter(
    p => p.faculty === user && p.day === today
  );

  main.innerHTML = `
    <h1>Today’s Overview (${user})</h1>

    <div class="cards">
      <div class="card">Today<br><h2>${today}</h2></div>
      <div class="card">Periods Today<br><h2>${todayPeriods.length}</h2></div>
      <div class="card">Total Periods<br><h2>${periods.length}</h2></div>
    </div>

    <button onclick="loadTimetable()">📅 Manage Periods</button>
  `;
}

/* ---------- TIMETABLE ---------- */
function loadTimetable() {
  main.innerHTML = `
    <h2>Weekly Timetable</h2>

    <div class="form">
      <input id="pname" placeholder="Period Name">
      <input id="cname" placeholder="Class Name">
      <select id="day">
        <option>Monday</option><option>Tuesday</option><option>Wednesday</option>
        <option>Thursday</option><option>Friday</option>
        <option>Saturday</option><option>Sunday</option>
      </select>
      <input type="time" id="stime">
      <input type="number" id="rem" placeholder="Reminder (min)">
      <button onclick="addPeriod()">Add Period</button>
    </div>

    <table class="table">
      <tr>
        <th>Day</th>
        <th>Period</th>
        <th>Class</th>
        <th>Start</th>
        <th>Reminder</th>
        <th>Action</th>
      </tr>
      ${renderRows()}
    </table>
  `;
}

/* ---------- RENDER TABLE ---------- */
function renderRows() {
  return periods
    .filter(p => role === "admin" || p.faculty === user)
    .map((p, i) => `
      <tr class="${isToday(p.day) ? "today" : ""}">
        <td>${p.day}</td>
        <td>${p.period}</td>
        <td>${p.class}</td>
        <td>${p.time}</td>
        <td>${p.rem} min</td>
        <td>
          <button onclick="deletePeriod(${i})">❌</button>
        </td>
      </tr>
    `).join("");
}

function isToday(day) {
  return new Date().toLocaleDateString("en-US",{weekday:"long"}) === day;
}

/* ---------- ADD PERIOD ---------- */
function addPeriod() {
  const period = {
    faculty: role === "admin" ? "F001" : user,
    period: pname.value,
    class: cname.value,
    day: day.value,
    time: stime.value,
    rem: rem.value
  };

  periods.push(period);
  localStorage.setItem("periods", JSON.stringify(periods));
  loadTimetable();
}

/* ---------- DELETE ---------- */
function deletePeriod(i) {
  periods.splice(i, 1);
  localStorage.setItem("periods", JSON.stringify(periods));
  loadTimetable();
}

/* ---------- LOGOUT ---------- */
function logout() {
  localStorage.clear();
  window.location.href = "index.html";
}
