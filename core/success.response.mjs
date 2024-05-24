

const { StatusCodes, ReasonPhrases } = require('../utils/httpStatusCode.mjs')


export class SuccessResponse {
    message;
    status;
    metadata ;
    constructor({ message = "", statusCode = StatusCodes.OK, reasonStatusCode = ReasonPhrases.OK, metadata = {} || null }) {
        this.message = !message ? reasonStatusCode : message
        this.status = statusCode
        this.metadata = metadata
    }

    send(res, header) {
        return res.status(this.status).json(this)
    }
}
export class OK extends SuccessResponse {
    constructor({ message = "", metadata = {} }) {
        super({ message, metadata })
    }
}
export class CREATED extends SuccessResponse {
    options;
    constructor({ options = {}, message = "", statusCode = StatusCodes.CREATED, reasonStatusCode = ReasonPhrases.CREATED, metadata = {} }) {
        super({ message, statusCode, reasonStatusCode, metadata });
        this.options = options;
    }
}