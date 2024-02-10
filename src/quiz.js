window.onload = ("DOMContentLoaded", () => {
  const quizContainer = document.querySelector(".quiz");
  
  const questionsGenerator = getQuestion();
  res = questionsGenerator.next();
  quizContainer.append(res.value);

  document.querySelector(".quiz").addEventListener("click", (e) => {
    if (e.target.id !== "submit") return;

    let question = Question.load(document.querySelector(".question").classList[0].split("-")[1]);

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

  let question = new Question();
  
  let i = 0;
  while (i < quiz.questions.length) {
    console.log(i);
    question.setData(quiz.questions[i]);

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

function getOptions(question) {
  let options = question.options;
  options = options.sort(() => Math.random() - 0.5);

  return options;
}

function renderQuestion(options) {
  // this is a Question object

  const question = document.createElement("div");
  question.classList.add(`question-${this.id}`, "question");
  question.innerHTML = `
    <h3>${this.questionText}</h3>
    <div class="options">
      ${renderOptions.call(options)}
    </div>
    <button id="submit">Submit Question</button>
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
  result.classList.add(`result-${this.id}`, "result", "question");
  result.innerHTML = `
    <h3>${this.questionText}</h3>
    <div class="options">
      ${this.options.map(option => {
        const id = option.id.toString();
        const responseValue = response.value?.toString();
        const correctAnswer = this.correctAnswer?.toString();

        if (id === correctAnswer && responseValue === id) {
          return `
            <div class="option-${id} option correct">
              <label for="option-${id}">${option.value}</label>
            </div>
          `
        }
        else if (responseValue === id) {
          return `
            <div class="option-${id} option incorrect">
              <label for="option-${id}">${option.value}</label>
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
    <button id="next">Next Question</button>
  `;

  return result;
}
