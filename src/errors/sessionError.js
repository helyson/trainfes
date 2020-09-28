class SessionError extends Error {
    constructor() {
        super('user or password invalid');

        this.name = 'LoginError';
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

module.exports = SessionError;