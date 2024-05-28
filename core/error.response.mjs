const { StatusCodes, ReasonPhrases } = require('../utils/httpStatusCode')
class ErrorResponse extends Error {
    status;
    constructor(message, status) {
        super(message);
        this.status = status;
    }
}

export class ConflictRequestError extends ErrorResponse {
    constructor(message = ReasonPhrases.CONFLICT, statusCode = StatusCodes.FORBIDDEN) {
        super(message, statusCode);
    }
}

export class BadRequestError extends ErrorResponse {
    constructor(message = ReasonPhrases.CONFLICT, statusCode = StatusCodes.FORBIDDEN) {
        super(message, statusCode);
    }
}

export class AuthFailedError extends ErrorResponse {
    constructor(message = ReasonPhrases.UNAUTHORIZED, statusCode = StatusCodes.UNAUTHORIZED) {
        super(message, statusCode);
    }
}
export class NotFoundError extends ErrorResponse {
    constructor(message = ReasonPhrases.NOT_FOUND, statusCode = StatusCodes.NOT_FOUND) {
        super(message, statusCode);
    }
}

export class ForbiddenError extends ErrorResponse {
    constructor(message = ReasonPhrases.FORBIDDEN, statusCode = StatusCodes.FORBIDDEN) {
        super(message, statusCode);
    }
}
