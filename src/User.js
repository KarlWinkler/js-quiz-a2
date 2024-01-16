class User {
  static id = localStorage.getItem("user-id") || 0;

  constructor(username) {
    this.id = null;
    this.username = username;
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
