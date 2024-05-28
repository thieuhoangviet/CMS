import {statusCodes} from '../utils/statusCodes.mjs';
import {reasonPhrases} from '../utils/reasonPhrases.mjs';

export class SuccessResponse {
    message;
    status;
    metadata ;
    constructor({ message = "", statusCode = statusCodes.OK, reasonStatusCode = reasonPhrases.OK, metadata = {} || null }) {
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
    constructor({ options = {}, message = "", statusCode = statusCodes.CREATED, reasonStatusCode = reasonPhrases.CREATED, metadata = {} }) {
        super({ message, statusCode, reasonStatusCode, metadata });
        this.options = options;
    }
}