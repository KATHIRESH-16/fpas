const users = JSON.parse(localStorage.getItem("users")) || {
  A001:{role:"admin",pass:"admin123"},
  A002:{role:"admin",pass:"admin123"},
  A003:{role:"admin",pass:"admin123"},
  F001:{role:"faculty",pass:"faculty123"},
  F002:{role:"faculty",pass:"faculty123"},
  F003:{role:"faculty",pass:"faculty123"},
  F004:{role:"faculty",pass:"faculty123"},
  F005:{role:"faculty",pass:"faculty123"},
  F006:{role:"faculty",pass:"faculty123"},
  F007:{role:"faculty",pass:"faculty123"}
};
localStorage.setItem("users",JSON.stringify(users));

let a = Math.floor(Math.random()*10), b=Math.floor(Math.random()*10);
document.getElementById("capText").innerText = `${a} + ${b} = ?`;

function togglePass(){
  password.type = password.type==="password"?"text":"password";
}

function login(){
  if(parseInt(captcha.value)!==(a+b)) return alert("Captcha incorrect");

  const id = userid.value;
  const pass = password.value;

  if(users[id] && users[id].pass===pass){
    localStorage.setItem("user",id);
    localStorage.setItem("role",users[id].role);
    location.href="dashboard.html";
  } else alert("Invalid credentials");
}
