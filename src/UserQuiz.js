class UserQuiz {
  static id = localStorage.getItem("userquiz-id") || 0;

  constructor(user = null, quiz = null, score = 0, currentQuestion = null, answeredQuestions = []) {
    this.id = null;
    this.user = user;
    this.quiz = quiz;
    this.score = score;
    this.currentQuestion = currentQuestion;
    this.answeredQuestions = answeredQuestions;
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

  setData(data) {
    this.id = data.id
    this.user = data.user;
    this.quiz = data.quiz;
    this.score = data.score;
    this.currentQuestion = data.currentQuestion;
    this.answeredQuestions = data.answeredQuestions;

    return this;
  }

  static load(id) {
    const userQuiz = JSON.parse(localStorage.getItem(`userquiz-${id}`));
    if (!userQuiz) return null;

    let newUserQuiz = new UserQuiz();

    newUserQuiz.setData(userQuiz);

    return newUserQuiz;
  }

  static find(user, quiz) {
    for (const key in localStorage) {
      if(key.includes("userquiz-")) {
        const userQuiz = JSON.parse(localStorage.getItem(key));
        if (userQuiz.user === user && userQuiz.quiz === quiz) {
          return new UserQuiz().setData(userQuiz);
        }
      }
    }

    return new UserQuiz(user, quiz).save();
  }
}
