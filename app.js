const root = document.getElementById("root");

root.innerHTML = `
  <div class="container">
    <div class="sidebar">
      <h2>FPAS</h2>
      <a href="#">Dashboard</a>
      <a href="#">Weekly Calendar</a>
      <a href="#">My Periods</a>
      <a href="#">Logout</a>
    </div>

    <div class="main">
      <h1>Today’s Overview</h1>

      <div class="cards">
        <div class="card">Total Periods<br><h2>24</h2></div>
        <div class="card">Faculty Load<br><h2>18 hrs</h2></div>
        <div class="card">Free Slots<br><h2>6</h2></div>
      </div>

      <div class="chart-box">
        <canvas id="workChart"></canvas>
      </div>

      <div class="chart-box">
        <iframe
          src="https://calendar.google.com/calendar/embed?mode=WEEK"
          width="100%"
          height="400">
        </iframe>
      </div>
    </div>
  </div>
`;

/* Chart.js */
new Chart(document.getElementById("workChart"), {
  type: "bar",
  data: {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri"],
    datasets: [{
      label: "Faculty Hours",
      data: [4, 3, 5, 4, 2],
      backgroundColor: "#38bdf8"
    }]
  },
  options: {
    responsive: true,
    plugins: {
      legend: {
        labels: { color: "white" }
      }
    },
    scales: {
      x: { ticks: { color: "white" } },
      y: { ticks: { color: "white" } }
    }
  }
});
