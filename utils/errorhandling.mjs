export class HttpError extends Error {
    status;
    constructor(message, status) {
        super(message);
        this.status = status;
        this.name = 'HttpError';
    }
}