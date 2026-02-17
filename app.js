if(!localStorage.getItem("users")){
    const defaultUsers = {
        A001:{role:"admin",pass:"admin123"},
        F001:{role:"faculty",pass:"faculty123"}
    };
    localStorage.setItem("users",JSON.stringify(defaultUsers));
}

function togglePass(){
    const p=document.getElementById("password");
    p.type=p.type==="password"?"text":"password";
}

function login(){
    const id=document.getElementById("userid").value.trim();
    const pass=document.getElementById("password").value;
    const users=JSON.parse(localStorage.getItem("users"));

    if(users[id] && users[id].pass===pass){
        localStorage.setItem("user",id);
        localStorage.setItem("role",users[id].role);
        window.location="dashboard.html";
    } else {
        alert("Invalid credentials");
    }
}

if("serviceWorker" in navigator){
    navigator.serviceWorker.register("service-worker.js");
}
