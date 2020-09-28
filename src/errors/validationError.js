class ValidationError extends Error {
    constructor(error) {
        super(error.message);

        this.name = 'ValidationError';
        this.status = 400;
    }

    toJson() {
        return {
            name: this.name,
            status: this.status,
            message: this.message,
        };
    }
}

module.exports = ValidationError;