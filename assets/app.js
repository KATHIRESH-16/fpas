const periods = [
  { subject: "Math", time: "10:00 - 11:00" },
  { subject: "Physics", time: "11:15 - 12:15" }
];

const container = document.getElementById("periods");

periods.forEach(p => {
  const div = document.createElement("div");
  div.className = "period";
  div.innerHTML = `<b>${p.subject}</b><br>${p.time}`;
  container.appendChild(div);
});

function enableNotifications() {
  Notification.requestPermission().then(permission => {
    if (permission === "granted") {
      new Notification("FPAS Enabled", {
        body: "You will receive period alerts"
      });
    }
  });
}

// Example auto alert
setTimeout(() => {
  if (Notification.permission === "granted") {
    new Notification("Period Starting Soon", {
      body: "Math class starts in 10 minutes"
    });
  }
}, 5000);
