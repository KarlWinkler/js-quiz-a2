document.addEventListener("DOMContentLoaded", () => {
  if (localStorage.getItem("current-user")) {
    const user = User.load(localStorage.getItem("current-user"));
    document.getElementById("username").value = user.username;
  }

  document.getElementById("login").addEventListener("click", () => {
    const username = document.getElementById("username").value;
    const user = new User().login(username);

    document.getElementById("user").innerHTML = user.username;
    document.getElementById("nav-login").innerHTML = "Logout";
    window.location.href = "/";
  });
});