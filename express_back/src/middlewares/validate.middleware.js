import { ValidationAppError } from '../errors/app.error.js';

export function validate(validatorFn, options = {}) {
    const target = options.target || 'body';

    return (req, res, next) => {
        const payload = req[target] || {};
        const errors = validatorFn(payload, req) || [];

        if (!Array.isArray(errors)) {
            return next(new ValidationAppError('Le validateur doit retourner un tableau d erreurs'));
        }

        if (errors.length > 0) {
            return next(new ValidationAppError('Validation invalide', { errors }));
        }

        return next();
    };
}
