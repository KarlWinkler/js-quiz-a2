class UserQuiz {
  static id = localStorage.getItem("userquiz-id") || 0;

  constructor(user = null, quiz = null, scores = [], currentQuestion = null, answeredQuestions = []) {
    this.id = null;
    this.user = user;
    this.quiz = quiz;
    this.scores = scores;
    this.currentQuestion = currentQuestion;
    this.answeredQuestions = answeredQuestions;
    this.currentScore = 0;
  }

  updateScore(correct) {
    if (correct) { this.currentScore++ }
    console.log(this.currentScore);
    this.save();
  }

  complete() {
    console.log("complete");
    this.answeredQuestions = [];
    this.currentQuestion = null;
    this.currentScore = 0;
    this.setScore();
  }

  setScore() {
    this.scores.push(this.currentScore);
    this.save();
  }

  highestScore() {
    return Math.max(...this.scores);
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
    this.scores = data.scores;
    this.currentQuestion = data.currentQuestion;
    this.answeredQuestions = data.answeredQuestions;
    this.currentScore = data.currentScore;

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
    console.log("user", user);
    console.log("quiz", quiz);
    for (const key in localStorage) {
      if(key.includes("userquiz-")) {
        const userQuiz = JSON.parse(localStorage.getItem(key));
        if (userQuiz.user == user && userQuiz.quiz == quiz) {
          return new UserQuiz().setData(userQuiz);
        }
      }
    }

    return null;
  }

  static findOrCreate(user, quiz) {
    for (const key in localStorage) {
      if(key.includes("userquiz-")) {
        const userQuiz = JSON.parse(localStorage.getItem(key));
        if (userQuiz.user == user && userQuiz.quiz == quiz) {
          return new UserQuiz().setData(userQuiz);
        }
      }
    }

    return new UserQuiz(user, quiz).save();
  }
}
