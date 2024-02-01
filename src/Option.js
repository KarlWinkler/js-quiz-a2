class Option {
  static id = localStorage.getItem("option-id") || 0;

  constructor(value = "") {
    this.id = null;
    this.value = value;
  }

  save() {
    if (!this.id) {
      this.id = ++Option.id;
      localStorage.setItem("option-id", Option.id);
    }

    localStorage.setItem(`option-${this.id}`, JSON.stringify(this));
    return this;
  }

  static load(id) {
    const option = JSON.parse(localStorage.getItem(`option-${id}`));
    if (!option) return null;

    let newOption = new Option();

    newOption.id = option.id;
    newOption.value = option.value;

    return option;
  }
}
