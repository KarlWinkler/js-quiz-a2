class Quiz {
  static id = 0;

  constructor(questions) {
    this.id = ++id;
    this.questions = questions;
    this.score = 0;
    this.description = "";
    this.notes = "";
    this.image = "";
    this.name = "";
    updatedAt = new Date();
    createdAt = new Date();
  }

  addQuestion(question) {
    this.questions.push(question);
  }

  save() {
    localStorage.setItem(`quiz-${id}`, JSON.stringify(this));
    updatedAt = new Date();
  }

  static load() {
    const quiz = JSON.parse(localStorage.getItem("quiz"));
    return quiz;
  }
}