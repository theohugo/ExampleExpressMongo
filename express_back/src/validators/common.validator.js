export function isObject(value) {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function isNonEmptyString(value, min = 1) {
    return typeof value === 'string' && value.trim().length >= min;
}

export function pushRequiredString(errors, payload, field, min = 1) {
    if (!isNonEmptyString(payload[field], min)) {
        errors.push(`${field} est requis`);
    }
}

export function pushOptionalString(errors, payload, field, min = 1) {
    if (payload[field] === undefined) return;
    if (!isNonEmptyString(payload[field], min)) {
        errors.push(`${field} doit etre une chaine valide`);
    }
}

export function pushRequiredNumber(errors, payload, field, min = null) {
    const value = payload[field];
    if (typeof value !== 'number' || Number.isNaN(value)) {
        errors.push(`${field} doit etre un nombre`);
        return;
    }
    if (min !== null && value < min) {
        errors.push(`${field} doit etre >= ${min}`);
    }
}

export function pushOptionalNumber(errors, payload, field, min = null) {
    if (payload[field] === undefined) return;
    pushRequiredNumber(errors, payload, field, min);
}
