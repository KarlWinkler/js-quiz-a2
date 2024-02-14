document.addEventListener("DOMContentLoaded", () => {
  if (localStorage.getItem("current-user")) {
    const user = User.load(localStorage.getItem("current-user"));
    document.getElementById("user").innerHTML = user.username;

    document.getElementById("nav-login").innerHTML = "Logout";
  }

  document.getElementById("create-quiz").addEventListener("click", () => {
    localStorage.removeItem("current-quiz");
    window.location.href = "createQuiz.html";
  });

  console.log("nav.js");
  document.getElementById("nav-login").addEventListener("click", () => {
    if (localStorage.getItem("current-user")) {
      localStorage.removeItem("current-user");
    }

    window.location.href = "/";
  });
});