// Dummy faculty database
const facultyDB = [
  { id: "F001", name: "Kathiresh", password: "1234" },
  { id: "F002", name: "Arun", password: "1234" }
];

// LOGIN
function login() {
  const id = fid.value;
  const pwd = pwd.value;

  const user = facultyDB.find(f => f.id === id && f.password === pwd);
  if (!user) return alert("Invalid login");

  localStorage.setItem("user", JSON.stringify(user));
  showDashboard();
}

// LOGOUT
function logout() {
  localStorage.removeItem("user");
  location.reload();
}

// SHOW DASHBOARD
function showDashboard() {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) return;

  loginBox.classList.add("hidden");
  dashboard.classList.remove("hidden");
  fname.innerText = user.name;

  loadPeriods();
}

// ADD PERIOD (FACULTY-PRIVATE)
function addPeriod() {
  const user = JSON.parse(localStorage.getItem("user"));
  const periods = JSON.parse(localStorage.getItem("periods") || "[]");

  periods.push({
    facultyId: user.id,
    subject: subject.value,
    time: time.value
  });

  localStorage.setItem("periods", JSON.stringify(periods));
  loadPeriods();
  scheduleAlert(subject.value);
}

// LOAD ONLY LOGGED-IN FACULTY PERIODS
function loadPeriods() {
  const user = JSON.parse(localStorage.getItem("user"));
  const periods = JSON.parse(localStorage.getItem("periods") || "[]");

  periodList.innerHTML = "";
  periods
    .filter(p => p.facultyId === user.id)
    .forEach(p => {
      const div = document.createElement("div");
      div.className = "period";
      div.innerHTML = `<b>${p.subject}</b><br>${p.time}`;
      periodList.appendChild(div);
    });
}

// NOTIFICATION
function scheduleAlert(subject) {
  Notification.requestPermission().then(p => {
    if (p === "granted") {
      setTimeout(() => {
        new Notification("FPAS Alert", {
          body: `Upcoming class: ${subject}`
        });
      }, 5000);
    }
  });
}

// AUTO LOGIN
showDashboard();
