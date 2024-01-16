class UserQuiz {
  static id = localStorage.getItem("user-quiz-id") || 0;

  constructor(value) {
    this.id = null;
    this.value = value;
  }

  save() {
    if (!this.id) {
      this.id = ++UserQuiz.id;
      localStorage.setItem("user-quiz-id", UserQuiz.id);
    }

    localStorage.setItem(`user-quiz-${this.id}`, JSON.stringify(this));
  }

  static load(id) {
    const userQuiz = JSON.parse(localStorage.getItem(`user-quiz-${id}`));
    if (!userQuiz) return null;

    let newUserQuiz = new UserQuiz();

    newUserQuiz.id = userQuiz.id;
    newUserQuiz.value = userQuiz.value;

    return userQuiz;
  }
}
