document.addEventListener("DOMContentLoaded", () => {
  quiz = Quiz.load(localStorage.getItem("current-quiz"));
  userQuiz = UserQuiz.load(localStorage.getItem("current-userquiz"));

  let score = document.createElement("p");
  score.classList.add("score");
  score.innerHTML = `Your score is: ${userQuiz.currentScore}/${quiz.questions.length}`;

  container = document.querySelector("#done");
  container.prepend(score);
  userQuiz .complete();
});
