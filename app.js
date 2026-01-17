function login() {
  const role = document.getElementById("role").value;
  const user = document.getElementById("username").value;

  localStorage.setItem("role", role);
  localStorage.setItem("user", user);

  window.location.href = "dashboard.html";
}
