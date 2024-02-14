window.onload = ("DOMContentLoaded", () => {
  const quizContainer = document.querySelector(".quiz");
  
  const questionsGenerator = getQuestion();
  res = questionsGenerator.next();
  quizContainer.append(res.value);

  document.querySelector(".quiz").addEventListener("click", (e) => {
    if (e.target.id !== "submit") return;

    if (!document.querySelector("input:checked")) {
      document.querySelectorAll(".error").forEach(error => error.remove());

      let message = document.createElement("p");
      message.innerHTML = "Please select an option";
      message.classList.add("error");
      e.target.parentElement.prepend(message);
      return;
    }

    let question = Question.load(document.querySelector(".quiz-question").classList[0].split("-")[1]);

    const quizContainer = document.querySelector(".quiz");
    res = questionsGenerator.next();

    let selectedOption = document.querySelector("input:checked") ? document.querySelector("input:checked").value : null;
    let userQuiz = UserQuiz.load(localStorage.getItem("current-userquiz"));
    userQuiz.updateScore(selectedOption == question?.correctAnswer);

    res = questionsGenerator.next({value: selectedOption});
    quizContainer.innerHTML = "";
    quizContainer.append(res.value);
  });

  document.querySelector(".quiz").addEventListener("click", (e) => {
    if (e.target.id !== "next") return;

    const quizContainer = document.querySelector(".quiz");
    res = questionsGenerator.next();
    if (res.done) {
      window.location.href = "done.html";
    } else {
      quizContainer.innerHTML = "";
      quizContainer.append(res.value);
    }
  });
});

function* getQuestion() {
  const quiz = Quiz.load(localStorage.getItem("current-quiz"));
  let userQuiz = UserQuiz.load(localStorage.getItem("current-userquiz"));
  let [easy, medium, hard] = getQuestionSets(quiz.questions);
  let ratios = [
    easy.length / quiz.questions.length, 
    medium.length / quiz.questions.length,
    hard.length / quiz.questions.length
  ]

  let question = new Question();
  
  let i = 0;
  let nextQuestion = null;
  while (i < quiz.questions.length) {
    [nextQuestion, ratios] = fetchNextQuestion.apply(quiz, [easy, medium, hard, ratios]);

    question.setData(nextQuestion);

    userQuiz = UserQuiz.load(localStorage.getItem("current-userquiz"));
    userQuiz.currentQuestion = question.id;
    userQuiz.save();

    const options = getOptions(question);

    yield renderQuestion.apply(question, [options]);
    let response = yield "response";
    userQuiz = UserQuiz.load(localStorage.getItem("current-userquiz"));
    userQuiz.answeredQuestions.push(question.id);
    userQuiz.save();

    yield renderResult.apply(question, [response, options]);

    i++;
  }
}

function getQuestionSets(questions) {
  let easy = [];
  let medium = [];
  let hard = [];

  questions.forEach(question => {
    if (question.difficulty == 0) {
      easy.push(question);
    }
    else if (question.difficulty == 1) {
      medium.push(question);
    }
    else {
      hard.push(question);
    }
  });

  return [easy, medium, hard];
}

function getOptions(question) {
  let options = question.options;
  options = options.sort(() => Math.random() - 0.5);

  return options;
}

function fetchNextQuestion(easy, medium, hard, ratios) {
  let nextQuestion = null;

  let random = Math.random(1);
  let difficulty = 0;

  if (random < ratios[0]) {
    nextQuestion = easy.shift();
    difficulty = 0;
  }
  else if (random < ratios[0] + ratios[1]) {
    nextQuestion = medium.shift();
    difficulty = 1;
  }
  else {
    nextQuestion = hard.shift();
    difficulty = 2;
  }

  adjustRatios(easy, medium, hard, ratios, difficulty);
  return [nextQuestion, ratios];
}

function adjustRatios(easy, medium, hard, ratios, difficulty) {
  const scale = 0.2;

  if (difficulty === 0) {
    ratios[1] += ratios[0] * ((1 - scale) / 2);
    ratios[2] += ratios[0] * ((1 - scale) / 2);
    ratios[0] = ratios[0] * scale;
  }
  else if (difficulty === 1) {
    ratios[0] += ratios[1] * ((1 - scale) / 2);
    ratios[2] += ratios[1] * ((1 - scale) / 2);
    ratios[1] = ratios[1] * scale;
  }
  else {
    ratios[0] += ratios[2] * ((1 - scale) / 2);
    ratios[1] += ratios[2] * ((1 - scale) / 2);    
    ratios[2] = ratios[2] * scale;
  }

  let pool = 0;
  let count = 3;

  if (easy.length === 0) {
    pool += ratios[0];
    ratios[0] = 0;
    count--;
  }
  if (medium.length === 0) {
    pool += ratios[1];
    ratios[1] = 0;
    count--;
  }
  if (hard.length === 0) {
    pool += ratios[2];
    ratios[2] = 0;
    count--;
  }

  if (easy.length > 0) {
    ratios[0] += pool / count;
  }
  if (medium.length > 0) {
    ratios[1] += pool / count;
  }
  if (hard.length > 0) {
    ratios[2] += pool / count;
  }

  console.log(ratios);
  return ratios;
}

function renderQuestion(options) {
  // this is a Question object

  const question = document.createElement("div");
  question.classList.add(`question-${this.id}`, "quiz-question", "content");
  question.innerHTML = `
    <h3>${this.questionText}</h3>
    <p>Difficulty: ${this.difficultyString()}</p>
    <div class="options">
      ${renderOptions.call(options)}
    </div>
    <div class="submit-container">
      <button id="submit" class="button button-secondary">Submit</button>
    <div>
  `;

  return question;
}

function renderOptions() {
  let optionElements = this.map(option => (
    `
      <div class="option-${option.id} option">
        <input type="radio" name="question-${this.id}" id="option-${option.id}" value="${option.id}">
        <label for="option-${option.id}">${option.value}</label>
      </div>
    `
  ));

  return optionElements.join("");
}

function renderResult(response) {
  // this is a Question object

  const result = document.createElement("div");
  result.classList.add(`result-${this.id}`, "result", "quiz-question", "content");
  result.innerHTML = `
    <h3>${this.questionText}</h3>
    <div class="options results">
      ${this.options.map(option => {
        const id = option.id.toString();
        const responseValue = response.value?.toString();
        const correctAnswer = this.correctAnswer?.toString();

        if (id === correctAnswer && responseValue === id) {
          return `
            <div class="option-${id} option correct">
              <label for="option-${id}">${option.value}</label>
              <img class="option-icon" src="images/check.svg" alt="correct">
            </div>
          `
        }
        else if (responseValue === id) {
          return `
            <div class="option-${id} option incorrect">
              <label for="option-${id}">${option.value}</label>
              <img class="option-icon" src="images/x.svg" alt="incorrect">
            </div>
          `
        }
        else {
          return `
            <div class="option-${id} option">
              <label for="option-${id}">${option.value}</label>
            </div>
          `
        }
      }).join("")}
    </div>
    <button id="next" class="button button-secondary">Next Question</button>
  `;

  return result;
}
