class UserQuiz {
  static id = localStorage.getItem("userquiz-id") || 0;

  constructor(score = 0, quiz = null) {
    this.id = null;
    this.score = score;
    this.quiz = quiz;
  }

  updateScore(correct) {
    if (correct) { this.score++ }
    this.save();
  }

  save() {
    if (!this.id) {
      this.id = ++UserQuiz.id;
      localStorage.setItem("userquiz-id", UserQuiz.id);
    }

    localStorage.setItem(`userquiz-${this.id}`, JSON.stringify(this));
    return this;
  }

  static load(id) {
    const userQuiz = JSON.parse(localStorage.getItem(`userquiz-${id}`));
    if (!userQuiz) return null;

    let newUserQuiz = new UserQuiz();

    newUserQuiz.id = userQuiz.id;
    newUserQuiz.value = userQuiz.value;

    return userQuiz;
  }
}
