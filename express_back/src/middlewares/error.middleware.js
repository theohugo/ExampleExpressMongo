import ApiResponse from '../utils/apiResponse.js';
import { AppError } from '../errors/app.error.js';

export function errorHandler(err, req, res, next) {
    if (res.headersSent) {
        return next(err);
    }

    if (err instanceof AppError) {
        return ApiResponse.error(
            res,
            err.message,
            err.details,
            err.statusCode,
            err.code
        );
    }

    if (err?.name === 'ValidationError') {
        return ApiResponse.badRequest(res, err.message);
    }

    if (err?.code === 11000) {
        return ApiResponse.badRequest(res, 'Contrainte d unicite violee');
    }

    return ApiResponse.error(
        res,
        'Erreur interne du serveur',
        null,
        500,
        process.env.NODE_ENV === 'production' ? null : err?.message
    );
}
