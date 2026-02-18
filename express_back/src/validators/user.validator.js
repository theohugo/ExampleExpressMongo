import {
    isObject,
    pushOptionalString,
    pushRequiredString,
} from './common.validator.js';

const EMAIL_REGEX = /^\S+@\S+\.\S+$/;
const PHONE_REGEX = /^[0-9]{10}$/;
const ALLOWED_ROLES = new Set(['VENDEUR', 'CLIENT']);

export function validateCreateUserPayload(payload) {
    const errors = [];
    if (!isObject(payload)) return ['Le body doit etre un objet JSON'];

    pushRequiredString(errors, payload, 'nom', 2);
    pushRequiredString(errors, payload, 'prenom', 2);
    pushRequiredString(errors, payload, 'email', 3);
    pushRequiredString(errors, payload, 'password', 6);

    if (typeof payload.email === 'string' && !EMAIL_REGEX.test(payload.email)) {
        errors.push('email invalide');
    }
    if (payload.age !== undefined && (!Number.isInteger(payload.age) || payload.age < 18 || payload.age > 150)) {
        errors.push('age doit etre un entier entre 18 et 150');
    }
    if (payload.telephone !== undefined && (typeof payload.telephone !== 'string' || !PHONE_REGEX.test(payload.telephone))) {
        errors.push('telephone doit contenir 10 chiffres');
    }
    if (payload.role !== undefined && !ALLOWED_ROLES.has(payload.role)) {
        errors.push('role invalide');
    }
    if (payload.adresse !== undefined && !isObject(payload.adresse)) {
        errors.push('adresse doit etre un objet');
    }

    return errors;
}

export function validateUpdateUserPayload(payload) {
    const errors = [];
    if (!isObject(payload)) return ['Le body doit etre un objet JSON'];

    pushOptionalString(errors, payload, 'nom', 2);
    pushOptionalString(errors, payload, 'prenom', 2);
    pushOptionalString(errors, payload, 'email', 3);
    pushOptionalString(errors, payload, 'password', 6);

    if (typeof payload.email === 'string' && !EMAIL_REGEX.test(payload.email)) {
        errors.push('email invalide');
    }
    if (payload.age !== undefined && (!Number.isInteger(payload.age) || payload.age < 18 || payload.age > 150)) {
        errors.push('age doit etre un entier entre 18 et 150');
    }
    if (payload.telephone !== undefined && (typeof payload.telephone !== 'string' || !PHONE_REGEX.test(payload.telephone))) {
        errors.push('telephone doit contenir 10 chiffres');
    }
    if (payload.role !== undefined && !ALLOWED_ROLES.has(payload.role)) {
        errors.push('role invalide');
    }
    if (payload.actif !== undefined && typeof payload.actif !== 'boolean') {
        errors.push('actif doit etre un booleen');
    }
    if (payload.adresse !== undefined && !isObject(payload.adresse)) {
        errors.push('adresse doit etre un objet');
    }

    return errors;
}
