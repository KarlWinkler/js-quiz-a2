class Question {
  static id = localStorage.getItem("question-id") || 0;

  constructor() {
    this.id = null;
    this.questionText = "";
    this.options = [];
    this.correctAnswer = null;
  }

  addOption(option) {
    const duplicate = this.options.findIndex(q => q.id === option.id);
    console.log(duplicate);

    if (duplicate >= 0) {
      this.options[duplicate] = option;
    }
    else {
      this.options.push(option);
    }

    this.save();
  }

  save() {
    if (!this.id) {
      this.id = ++Question.id;
      localStorage.setItem("question-id", Question.id);
    }

    localStorage.setItem(`question-${this.id}`, JSON.stringify(this));
  }

  static load(id) {
    const question = JSON.parse(localStorage.getItem(`question-${id}`));
    if (!question) return null;

    let newQuestion = new Question();

    newQuestion.id = question.id;
    newQuestion.questionText = question.questionText;
    newQuestion.options = question.options;
    newQuestion.correctAnswer = question.correctAnswer;

    return newQuestion;    
  }
}
