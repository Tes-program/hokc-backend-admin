import { HttpStatusCode } from "src/utils/enum/httpCode";

export class BaseError extends Error {
    public readonly name: string;
    public readonly httpCode: HttpStatusCode;
    public readonly isOperational: boolean;

    constructor(name: string, httpCode: HttpStatusCode, description: string, isOperational: boolean) {
        super(description);
        Object.setPrototypeOf(this, new.target.prototype);
      
        this.name = name;
        this.httpCode = httpCode;
        this.isOperational = isOperational;
      
        Error.captureStackTrace(this);
      }
}

export class APIError extends BaseError {
    constructor(name: string, httpCode: HttpStatusCode, description: string, isOperational: boolean) {
        super(name, httpCode, description, isOperational);
    }
}

export class InternalServerError extends APIError {
    constructor(description: string) {
        super('InternalServerError', HttpStatusCode.INTERNAL_SERVER_ERROR, description, true);
    }
}

export class BadRequestError extends APIError {
    constructor(description: string) {
        super('BadRequestError', HttpStatusCode.BAD_REQUEST, description, true);
    }
}

export class NotFoundError extends APIError {
    constructor(description: string) {
        super('NotFoundError', HttpStatusCode.NOT_FOUND, description, true);
    }
}

export class UnauthorizedError extends APIError {
    constructor(description: string) {
        super('UnauthorizedError', HttpStatusCode.UNAUTHORIZED, description, true);
    }
}

export class ForbiddenError extends APIError {
    constructor(description: string) {
        super('ForbiddenError', HttpStatusCode.FORBIDDEN, description, true);
    }
}

export class ConflictError extends APIError {
    constructor(description: string) {
        super('ConflictError', HttpStatusCode.CONFLICT, description, true);
    }
}

export class RateLimitError extends APIError {
    constructor(description: string) {
        super('RateLimitError', HttpStatusCode.RESOURCE_EXHAUSTED, description, true);
    }
}

