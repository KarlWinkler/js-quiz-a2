class User {
  static id = localStorage.getItem("user-id") || 0;

  constructor(username = "anonymous") {
    this.id = null;
    this.username = username;
  }

  // finds existing user or creates a new one
  // then sets the current user
  login(username) {
    for (const key in localStorage) {
      if (key.includes("user-")) {
        const user = JSON.parse(localStorage.getItem(key));
        if (user.username === username) {
          this.id = user.id;
          this.username = user.username;
          this.setCurrentUser();
          return this;
        }
      }
    };

    this.username = username;
    this.save();
    this.setCurrentUser();
    return this;
  }

  setCurrentUser() {
    localStorage.setItem("current-user", this.id);
  }

  save() {
    if (!this.id) {
      this.id = ++User.id;
      localStorage.setItem("user-id", User.id);
    }

    localStorage.setItem(`user-${this.id}`, JSON.stringify(this));
  }

  static load(id) {
    const user = JSON.parse(localStorage.getItem(`user-${id}`));
    if (!user) return null;

    let newUser = new User();

    newUser.id = user.id;
    newUser.username = user.username;

    return user;
  }
}
