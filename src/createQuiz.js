window.onload = ("DOMContentLoaded", () => {
  const currentQuiz = localStorage.getItem("current-quiz");
  let quiz = currentQuiz ? Quiz.load(currentQuiz) : new Quiz().save();

  if (currentQuiz) {
    const quiz = Quiz.load(currentQuiz);
    document.querySelector("#quiz-name").value = quiz.name;
    document.querySelector("#quiz-description").value = quiz.description;
    document.querySelector("#quiz-tags").value = quiz.tags;
    document.querySelector("#quiz-notes").value = quiz.notes;
    document.querySelector("#quiz-image").value = quiz.image;

    document.querySelector("h1").innerHTML = `Edit Quiz (${quiz.name})`;
  }
  else {
    let firstQuestion = new Question();
    firstQuestion.save();
    quiz.addQuestion(firstQuestion);
  }
  
  document.querySelector(".quiz").value = quiz.id;

  for (const q in quiz.questions) {
    const question = Question.load(quiz.questions[q].id);
    newQuestion.call(question);
  }

  document.querySelector("#import").addEventListener("click", async () => {
    console.log("click");
    const amount = document.querySelector("#amount").value;
    const questionsResponse = await fetch(`https://opentdb.com/api.php?amount=${amount}`);
    const questions = await questionsResponse.json();

    questions.results.forEach(question => {
      options = [];
      const correctAnswer = new Option(question.correct_answer.trim()).save();
      options.push(correctAnswer);

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
    if (e.target.id === "add-option") {
      const questionID = e.target.parentElement.parentElement.classList[0].split("-")[1];
      let option = new Option();
      option.save();

      let question = Question.load(questionID);
      question.addOption(option);

      newOption.call(option, questionID);
    }

    if (e.target.id === "remove-question") {
      const questionElement = e.target.closest(".question");
      const questionId = questionElement.classList[0].split("-")[1];
      let question = Question.load(questionId);
      quiz.removeQuestion(question);
      questionElement.remove();
    }
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

  document.getElementById("delete").addEventListener("click", () => {
    quiz.delete();

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
      <button id="remove-question">Remove Question</button>
      <h3>Options</h3>
      <div class="options">
        <button id="add-option">Add Option</button>
      </div>
    `;

    questions.appendChild(newQuestion);

    // console.log(this.options)

    this.options.forEach(option => {
      newOption.call(option, this);
    });
  }

  function newOption(question) {
    // this is an Option object

    const options = document.querySelector(`.question-${question.id} .options`);
    const correctAnswer = this.id == question.correctAnswer;

    const option = document.createElement("div");
    option.classList.add("option");
    option.innerHTML = `
      <input type="radio" name="correct-answer-${question.id}" id="${this.id}" ${correctAnswer ? "checked" : ""}>
      <label value="${this.id}">Value</label>
      <input type="text" value="${this.value}" placeholder="Value">
    `;

    options.insertBefore(option, document.querySelector(`.question-${question.id} #add-option`));
  }
});
