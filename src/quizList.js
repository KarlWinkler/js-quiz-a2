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

  const newQuiz = document.createElement("div");
  newQuiz.classList.add(`quiz-${quiz.id}`, "quiz");
  newQuiz.innerHTML = `
    <h2>${quiz.name}</h2>
    <p>${quiz.description}</p>
    <p>${quiz.questions.length} questions</p>
    <p>${quiz.updatedAt}</p>
    <a href="quiz?id=${quiz.id}">Take Quiz</a>
  `;

  quizList.appendChild(newQuiz);
}