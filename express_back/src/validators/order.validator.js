import { isNonEmptyString, isObject } from './common.validator.js';

const ALLOWED_STATUS = new Set(['pending', 'paid', 'preparing', 'shipped', 'cancelled']);

export function validateCreateOrderPayload(payload) {
    const errors = [];
    if (!isObject(payload)) return ['Le body doit etre un objet JSON'];

    if (!isObject(payload.customer)) {
        errors.push('customer est requis');
    } else {
        if (!isNonEmptyString(payload.customer.name)) {
            errors.push('customer.name est requis');
        }
        if (!isNonEmptyString(payload.customer.address)) {
            errors.push('customer.address est requis');
        }
    }

    if (!Array.isArray(payload.items) || payload.items.length === 0) {
        errors.push('items doit contenir au moins un element');
    } else {
        payload.items.forEach((item, index) => {
            if (!isObject(item)) {
                errors.push(`items[${index}] doit etre un objet`);
                return;
            }
            if (!isNonEmptyString(item.beerId)) {
                errors.push(`items[${index}].beerId est requis`);
            }
            if (!Number.isInteger(item.quantity) || item.quantity <= 0) {
                errors.push(`items[${index}].quantity doit etre un entier > 0`);
            }
        });
    }

    if (payload.notes !== undefined && typeof payload.notes !== 'string') {
        errors.push('notes doit etre une chaine');
    }

    return errors;
}

export function validateUpdateOrderStatusPayload(payload) {
    const errors = [];
    if (!isObject(payload)) return ['Le body doit etre un objet JSON'];

    if (typeof payload.status !== 'string' || !ALLOWED_STATUS.has(payload.status)) {
        errors.push(`status doit etre parmi: ${[...ALLOWED_STATUS].join(', ')}`);
    }

    return errors;
}
