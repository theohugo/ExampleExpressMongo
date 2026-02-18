import { isNonEmptyString, isObject } from './common.validator.js';

export function validateAddCartItemPayload(payload) {
    const errors = [];
    if (!isObject(payload)) return ['Le body doit etre un objet JSON'];

    if (!isNonEmptyString(payload.beerId)) {
        errors.push('beerId est requis');
    }
    if (!Number.isInteger(payload.quantity) || payload.quantity <= 0) {
        errors.push('quantity doit etre un entier > 0');
    }

    return errors;
}

export function validateSetCartItemQuantityPayload(payload) {
    const errors = [];
    if (!isObject(payload)) return ['Le body doit etre un objet JSON'];

    if (!Number.isInteger(payload.quantity) || payload.quantity < 0) {
        errors.push('quantity doit etre un entier >= 0');
    }

    return errors;
}

export function validateCheckoutPayload(payload) {
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

    if (payload.notes !== undefined && typeof payload.notes !== 'string') {
        errors.push('notes doit etre une chaine');
    }

    return errors;
}
