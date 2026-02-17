const content=document.getElementById("content");
const user=localStorage.getItem("user");
const role=localStorage.getItem("role");

if(!user) location.href="index.html";

let users=JSON.parse(localStorage.getItem("users"));
let periods=JSON.parse(localStorage.getItem("periods")||"[]");

if(role!=="admin"){
    document.getElementById("adminPanelBtn").style.display="none";
    document.getElementById("userPanelBtn").style.display="none";
}

function showDashboard(){
    content.innerHTML=`
    <h1>Welcome ${user}</h1>
    <div class="card-container">
        <div class="card">Role: ${role}</div>
        <div class="card">Total Periods: ${periods.length}</div>
    </div>`;
}

function showTimetable(){
    const data=role==="admin"?periods:periods.filter(p=>p.faculty===user);
    content.innerHTML=`
    <h2>Weekly Timetable</h2>
    <table>
        <tr>
            <th>Faculty</th><th>Day</th><th>Subject</th><th>Time</th><th>Reminder</th>
        </tr>
        ${data.map(p=>`
            <tr>
                <td>${p.faculty}</td>
                <td>${p.day}</td>
                <td>${p.subject}</td>
                <td>${p.time}</td>
                <td>${p.rem} min</td>
            </tr>`).join("")}
    </table>`;
    if(role==="faculty") startAlerts(data);
}

function showAdminPanel(){
    content.innerHTML=`
    <h2>Add Period</h2>
    <input id="fac" placeholder="Faculty ID">
    <input id="day" placeholder="Day">
    <input id="subject" placeholder="Subject">
    <input type="time" id="time">
    <input type="number" id="rem" placeholder="Reminder minutes">
    <button onclick="addPeriod()">Add</button>`;
}

function addPeriod(){
    const fac=document.getElementById("fac").value;
    const day=document.getElementById("day").value;
    const subject=document.getElementById("subject").value;
    const time=document.getElementById("time").value;
    const rem=document.getElementById("rem").value;

    periods.push({faculty:fac,day,subject,time,rem});
    localStorage.setItem("periods",JSON.stringify(periods));
    alert("Period Added");
}

function showUserPanel(){
    content.innerHTML=`
    <h2>Create User</h2>
    <input id="uid" placeholder="User ID">
    <input id="upass" placeholder="Password">
    <select id="urole">
        <option value="faculty">Faculty</option>
        <option value="admin">Admin</option>
    </select>
    <button onclick="createUser()">Create</button>`;
}

function createUser(){
    const id=document.getElementById("uid").value;
    const pass=document.getElementById("upass").value;
    const role=document.getElementById("urole").value;

    if(users[id]) return alert("User exists");

    users[id]={role,pass};
    localStorage.setItem("users",JSON.stringify(users));
    alert("User Created");
}

function startAlerts(data){
    if(Notification.permission!=="granted"){
        Notification.requestPermission();
    }

    data.forEach(p=>{
        const [h,m]=p.time.split(":");
        const alertTime=new Date();
        alertTime.setHours(h);
        alertTime.setMinutes(m-p.rem);
        const delay=alertTime-new Date();

        if(delay>0){
            setTimeout(()=>{
                new Notification("FPAS Reminder",{
                    body:`${p.subject} starts in ${p.rem} minutes`
                });
            },delay);
        }
    });
}

function toggleTheme(){
    document.body.classList.toggle("dark");
}

function logout(){
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    location.href="index.html";
}

showDashboard();
