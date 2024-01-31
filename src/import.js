window.onload = ("DOMContentLoaded", () => {
  importButton = document.querySelector("#import");
  console.log(importButton);

  importButton.onclick = async () => {
    console.log("click");
    const questionsResponse = await fetch("http://opentdb.com/api.php?amount=10");
    const questions = await questionsResponse.json();
    console.log(questions);
  }
});