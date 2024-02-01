window.onload = ("DOMContentLoaded", () => {
  document.getElementById("login").addEventListener("click", () => {
    const username = document.getElementById("username").value;
    const user = new User().login(username);
    console.log(user);
  });
});