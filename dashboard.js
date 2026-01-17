const role = localStorage.getItem("role");
const user = localStorage.getItem("user");
const main = document.getElementById("main");

loadDashboard();

function loadDashboard() {
  main.innerHTML = `
    <h1>Today’s Overview (${user})</h1>

    <div class="cards">
      <div class="card">Today Periods<br>2</div>
      <div class="card">Next Class<br>10:30 AM</div>
      <div class="card">Alerts Active<br>Yes</div>
    </div>

    <canvas id="chart"></canvas>
  `;

  new Chart(chart, {
    type: "bar",
    data: {
      labels: ["Mon","Tue","Wed","Thu","Fri"],
      datasets: [{
        label: "Periods",
        data: [2,3,1,4,2],
        backgroundColor: "#38bdf8"
      }]
    }
  });
}

function loadTimetable() {
  main.innerHTML = `
    <h2>Weekly Timetable</h2>
    <table class="table">
      <tr><th class="today">Mon</th><th>Tue</th><th>Wed</th></tr>
      <tr><td>Math</td><td>Free</td><td>Physics</td></tr>
    </table>

    <h3>Create Period Alert</h3>
    <input type="time" id="ptime">
    <input type="number" id="mins" placeholder="Reminder minutes">
    <button onclick="setAlert()">Set Alert</button>
  `;
}

function setAlert() {
  const mins = document.getElementById("mins").value;
  alert(`Reminder set ${mins} minutes before class`);
}

function loadAdmin() {
  if (role !== "admin") {
    main.innerHTML = "<h2>Faculty cannot access Admin Panel</h2>";
    return;
  }

  main.innerHTML = `
    <h2>Admin Panel</h2>
    <input placeholder="Faculty ID">
    <input placeholder="Subject">
    <input type="time">
    <button>Add Period</button>
  `;
}

function toggleTheme() {
  document.body.classList.toggle("light");
}

function logout() {
  localStorage.clear();
  window.location.href = "index.html";
}
