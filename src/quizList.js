window.onload = ("DOMContentLoaded", () => {
  let quizList = [];

  numberOfQuizzes = localStorage.getItem("quiz-id") || 0;
  
  for (let i = 1; i <= numberOfQuizzes; i++) {
    let quiz = Quiz.load(i);
    if (!quiz) continue;

    quizList.push(quiz);
  }


  quizList.forEach(quiz => {
    displayQuiz(quiz);
  });
});

function displayQuiz(quiz) {
  const quizList = document.querySelector("#quiz-list");
  const setQuiz = setCurrentQuiz.bind(quiz.id);

  console.log(setQuiz);
  const newQuiz = document.createElement("div");
  newQuiz.classList.add(`quiz-${quiz.id}`, "quiz");
  newQuiz.innerHTML = `
    <h2>${quiz.name}</h2>
    <p>${quiz.description}</p>
    <p>${quiz.questions.length} questions</p>
    <p>${quiz.updatedAt}</p>
    <button>Take Quiz</button>
  `;
  newQuiz.querySelector("button").onclick = setQuiz;

  quizList.appendChild(newQuiz);
}

function setCurrentQuiz() {
  localStorage.setItem("current-quiz", this);

  window.location.href = "/quiz";
}