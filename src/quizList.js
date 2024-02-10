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
  const startQuiz = startCurrentQuiz.bind(quiz.id);
  const editQuiz = editCurrentQuiz.bind(quiz.id);

  const newQuiz = document.createElement("div");
  newQuiz.classList.add(`quiz-${quiz.id}`, "quiz");
  newQuiz.innerHTML = `
    <img class="quiz-image" src="${quiz.image}" alt="${quiz.name} image">
    <h2>${quiz.name}</h2>
    <p>${quiz.description}</p>
    <p>${quiz.questions.length} questions</p>
    <p>${quiz.updatedAt}</p>
    ${displayQuizScore(quiz)}
    <button class="take">Take Quiz</button>
    <button class="edit">Edit Quiz</button>
  `;
  newQuiz.querySelector(".take").onclick = startQuiz;
  newQuiz.querySelector(".edit").onclick = editQuiz;

  quizList.appendChild(newQuiz);
}

function startCurrentQuiz() {
  localStorage.setItem("current-quiz", this);
  let user = localStorage.getItem("current-user")

  let userQuiz = UserQuiz.findOrCreate(user, this);
  localStorage.setItem("current-userquiz", userQuiz.id);
  userQuiz.currentScore = 0;
  userQuiz.save();

  console.log(userQuiz);

  window.location.href = "/quiz";
}

function editCurrentQuiz() {
  localStorage.setItem("current-quiz", this);
  window.location.href = "/create-quiz";
}

function displayQuizScore(quiz) {
  let currentUser = localStorage.getItem("current-user");
  console.log(currentUser);

  if (currentUser) {
    return `<p>${getUserQuizScore(quiz, currentUser)}/${quiz.questions.length}</p>`;
  }
  return "";
}

function getUserQuizScore(quiz, user) {
  let userQuiz = UserQuiz.find(user, quiz.id);
  console.log(userQuiz);

  return userQuiz?.highestScore() || 0;
}
