class Question {
  static id = localStorage.getItem("question-id") || 0;

  constructor(questionText, options, correctAnswer) {
    this.id = null;
    this.questionText = questionText || "";
    this.options = options || [];
    this.correctAnswer = correctAnswer || null;
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
    return this;
  }

  setData(question) {
    this.id = question.id;
    this.questionText = question.questionText;
    this.options = question.options;
    this.correctAnswer = question.correctAnswer;
  }

  static load(id) {
    const question = JSON.parse(localStorage.getItem(`question-${id}`));
    if (!question) return null;

    let newQuestion = new Question();

    newQuestion.setData(question);

    return newQuestion;    
  }
}
