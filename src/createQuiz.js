window.onload = ("DOMContentLoaded", () => {
  let quiz = new Quiz();
  quiz.save();
  document.querySelector(".quiz").value = quiz.id;

  let firstQuestion = new Question();
  firstQuestion.save();
  quiz.addQuestion(firstQuestion);

  newQuestion.call(firstQuestion);

  document.querySelector("#import").addEventListener("click", async () => {
    console.log("click");
    const questionsResponse = await fetch("https://opentdb.com/api.php?amount=1");
    const questions = await questionsResponse.json();

    questions.results.forEach(question => {
      options = [];
      const correctAnswer = new Option(question.correct_answer.trim()).save();
      options.push(correctAnswer);
      console.log(correctAnswer);

      question.incorrect_answers.forEach(incorrectAnswer => {
        options.push(new Option(incorrectAnswer.trim()).save());
      });

      const inputQuestion = new Question(question.question, options, correctAnswer.id).save();
      quiz.addQuestion(inputQuestion);
      newQuestion.call(inputQuestion);
    });
    console.log(questions.results);
  });

  document.querySelector("#add-question").addEventListener("click", () => {
    let question = new Question();
    quiz.addQuestion(question);
  
    question.save();
    let option = new Option().save();
    question.addOption(option);
  
    newQuestion.call(question);
  });

  document.querySelector("#questions").addEventListener("click", (e) => {
    if (e.target.id !== "add-option") return;

    const questionID = e.target.parentElement.parentElement.classList[0].split("-")[1];
    let option = new Option();
    option.save();

    let question = Question.load(questionID);
    question.addOption(option);

    newOption.call(option, questionID);
  });

  document.querySelector("#save").addEventListener("click", () => {
    let quizID = document.querySelector(".quiz").value;
    const quiz = Quiz.load(quizID);
    quiz.name = document.querySelector("#quiz-name").value;
    quiz.description = document.querySelector("#quiz-description").value;
    quiz.image = document.querySelector("#quiz-image").value;
    quiz.notes = document.querySelector("#quiz-notes").value;

    const questions = document.querySelectorAll(".question");
    questions.forEach(question => {
      const questionID = question.classList[0].split("-")[1];
      const questionText = question.querySelector("input[type=text]").value;
      const options = question.querySelectorAll(".option");
      const correctAnswer = question.querySelector("input[type=radio]:checked").id;

      let newQuestion = Question.load(questionID);
      newQuestion.questionText = questionText;
      newQuestion.correctAnswer = correctAnswer;

      options.forEach(option => {
        const optionID = option.querySelector("label").getAttribute("value");
        const optionValue = option.querySelector("input[type=text]").value;

        let newOption = Option.load(optionID);
        console.log(newOption);
        newOption.value = optionValue;
        newQuestion.addOption(newOption);
      });
      quiz.addQuestion(newQuestion);

      newQuestion.save();
    });

    quiz.save();
    document.location.href = '/';
  });

  function newQuestion() {
    // this is a Question object

    const questions = document.querySelector("#questions");

    const newQuestion = document.createElement("div");
    newQuestion.classList.add(`question-${this.id}`, "question");
    newQuestion.innerHTML = `
      <label>Question</label>
      <input type="text" value="${this.questionText}" placeholder="Question">

      <h3>Options</h3>
      <div class="options">
        <button id="add-option">Add Option</button>
      </div>
    `;

    questions.appendChild(newQuestion);

    // console.log(this.options)

    this.options.forEach(option => {
      newOption.call(option, this.id);
    });
  }

  function newOption(questionID) {
    // this is an Option object

    const options = document.querySelector(`.question-${questionID} .options`);

    const option = document.createElement("div");
    option.classList.add("option");
    option.innerHTML = `
      <input type="radio" name="correct-answer-${questionID}" id="${this.id}">
      <label value="${this.id}">Value</label>
      <input type="text" value="${this.value}" placeholder="Value">
    `;

    options.insertBefore(option, document.querySelector(`.question-${questionID} #add-option`));
  }
});
