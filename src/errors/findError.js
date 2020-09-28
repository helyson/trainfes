class FindError extends Error {
  constructor(error) {
    super("Item not found");
    this.name = "NotFound";
    this.status = 404;
    this.path = error.path;
    this.value = error.value;
  }

  toJson() {
    return {
      name: this.name,
      status: this.status,
      message: this.message,
      path: this.path,
      value: this.value
    };
  }
}

module.exports = FindError;
