window.onload = ("DOMContentLoaded", () => {
  const quizContainer = document.querySelector(".quiz");
  
  const questionsGenerator = getQuestion();
  res = questionsGenerator.next();
  console.log(res);
  quizContainer.append(res.value);

  document.querySelector(".quiz").addEventListener("click", (e) => {
    if (e.target.id !== "submit") return;
    console.log(document.querySelector(".question").classList[0].split("-"))
    console.log(JSON.parse(localStorage.getItem(`question-${document.querySelector(".question").classList[0].split("-")[1]}`)))

    let question = Question.load(document.querySelector(".question").classList[0].split("-")[1]);
    // console.log(question)

    const quizContainer = document.querySelector(".quiz");
    res = questionsGenerator.next();

    let selectedOption = document.querySelector("input:checked") ? document.querySelector("input:checked").value : null;
    let quiz = Quiz.load(localStorage.getItem("current-quiz"));
    quiz.updateScore(selectedOption == question?.correctAnswer);

    res = questionsGenerator.next({value: selectedOption});
    console.log(res);
    quizContainer.innerHTML = "";
    quizContainer.append(res.value);
  });

  document.querySelector(".quiz").addEventListener("click", (e) => {
    if (e.target.id !== "next") return;

    const quizContainer = document.querySelector(".quiz");
    res = questionsGenerator.next();
    console.log(res);
    quizContainer.innerHTML = "";
    quizContainer.append(res.value);
  });
});

function* getQuestion() {
  const quiz = Quiz.load(localStorage.getItem("current-quiz"));
  let question = new Question();
  
  let i = 0;
  while (i < quiz.questions.length) {
    console.log(i);
    question.setData(quiz.questions[i]);
    yield renderQuestion.call(question);
    let response = yield "response";
    console.log(response);
    yield renderResult.call(question, response);
    i++;
  }
}

function renderQuestion() {
  // this is a Question object

  const question = document.createElement("div");
  question.classList.add(`question-${this.id}`, "question");
  question.innerHTML = `
    <h3>${this.questionText}</h3>
    <div class="options">
      ${renderOptions.call(this)}
    </div>
    <button id="submit">Submit Question</button>
  `;

  return question;
}

function renderOptions() {
  console.log(this);
  let optionElements = this.options.map(option => (
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
