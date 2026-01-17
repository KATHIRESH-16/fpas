const role = localStorage.getItem("role");
const user = localStorage.getItem("user");
const main = document.getElementById("main");

let periods = JSON.parse(localStorage.getItem("periods")) || [];
let users = JSON.parse(localStorage.getItem("users"));

dashboard();

function dashboard(){
  main.innerHTML=`<h1>Welcome ${user}</h1>`;
}

function timetable(){
  const data = role==="admin"?periods:periods.filter(p=>p.faculty===user);
  main.innerHTML=`
  <h2>Weekly Timetable</h2>
  <table class="timetable">
    <tr>
      <th>Faculty</th><th>Day</th><th>Period</th><th>Class</th><th>Time</th><th>Reminder</th><th>✏️</th>
    </tr>
    ${data.map((p,i)=>`
      <tr>
        <td>${p.faculty}</td><td>${p.day}</td><td>${p.period}</td>
        <td>${p.class}</td><td>${p.time}</td><td>${p.rem} min</td>
        <td>${role==="admin"?`<button onclick="edit(${i})">✏️</button>`:"-"}</td>
      </tr>`).join("")}
  </table>`;
}

function adminPanel(){
  if(role!=="admin") return alert("Admin only");
  main.innerHTML=`
  <h2>Admin Timetable Creator</h2>
  <select id="fac"><option>ALL</option>${Object.keys(users).filter(u=>u.startsWith("F")).map(f=>`<option>${f}</option>`)}</select>
  <select id="day">${["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map(d=>`<option>${d}</option>`)}</select>
  <input id="period" placeholder="Period">
  <input id="class" placeholder="Class">
  <input type="time" id="time">
  <input id="rem" placeholder="Reminder">
  <button onclick="add()">Add</button>`;
}

function add(){
  const target = fac.value==="ALL"?Object.keys(users).filter(u=>u.startsWith("F")):[fac.value];
  target.forEach(f=>{
    periods.push({faculty:f,day:day.value,period:period.value,class:class.value,time:time.value,rem:rem.value});
  });
  localStorage.setItem("periods",JSON.stringify(periods));
  timetable();
}

function usersPanel(){
  if(role!=="admin") return alert("Admin only");
  main.innerHTML=`
  <h2>User Creation</h2>
  <input id="uid" placeholder="User ID">
  <input id="upass" placeholder="Password">
  <select id="urole"><option>faculty</option><option>admin</option></select>
  <button onclick="createUser()">Create</button>`;
}

function createUser(){
  users[uid.value]={role:urole.value,pass:upass.value};
  localStorage.setItem("users",JSON.stringify(users));
  alert("User created");
}

function exportPDF(){ window.print(); }
function logout(){ localStorage.clear(); location.href="index.html"; }
