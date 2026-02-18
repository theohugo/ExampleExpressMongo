export class AppError extends Error {
    constructor(message, statusCode = 500, code = 'INTERNAL_ERROR', details = null) {
        super(message);
        this.name = this.constructor.name;
        this.statusCode = statusCode;
        this.code = code;
        this.details = details;
    }
}

export class ValidationAppError extends AppError {
    constructor(message = 'Validation invalide', details = null) {
        super(message, 400, 'VALIDATION_ERROR', details);
    }
}

export class UnauthorizedAppError extends AppError {
    constructor(message = 'Acces non autorise', details = null) {
        super(message, 401, 'UNAUTHORIZED', details);
    }
}

export class NotFoundAppError extends AppError {
    constructor(message = 'Ressource non trouvee', details = null) {
        super(message, 404, 'NOT_FOUND', details);
    }
}
