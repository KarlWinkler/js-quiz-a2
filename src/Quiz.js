class Quiz {
  static id = localStorage.getItem("quiz-id") || 0;

  constructor() {
    this.id = null;
    this.questions = [];
    this.score = 0;
    this.description = "";
    this.notes = "";
    this.image = "";
    this.name = "";
    this.updatedAt = new Date();
    this.createdAt = new Date();
  }

  addQuestion(question) {
    const duplicate = this.questions.findIndex(q => q.id === question.id);
    console.log(duplicate);

    if (duplicate >= 0) {
      this.questions[duplicate] = question;
    }
    else {
      this.questions.push(question);
    }

    this.save();
  }

  save() {
    this.updatedAt = new Date();

    if (!this.id) {
      this.id = ++Quiz.id;
      localStorage.setItem("quiz-id", Quiz.id);
    }

    localStorage.setItem(`quiz-${this.id}`, JSON.stringify(this));
  }

  setData(quiz) {
    this.id = quiz.id;
    this.questions = quiz.questions;
    this.score = quiz.score;
    this.description = quiz.description;
    this.notes = quiz.notes;
    this.image = quiz.image;
    this.name = quiz.name;
    this.updatedAt = quiz.updatedAt;
    this.createdAt = quiz.createdAt;
  }

  static load(id) {
    const quiz = JSON.parse(localStorage.getItem(`quiz-${id}`));
    if (!quiz) return null;

    let newQuiz = new Quiz();

    newQuiz.setData(quiz);

    return newQuiz;
  }
}