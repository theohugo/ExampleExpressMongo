import {
    isObject,
    pushOptionalNumber,
    pushOptionalString,
    pushRequiredNumber,
    pushRequiredString,
} from './common.validator.js';

export function validateCreateBeerPayload(payload) {
    const errors = [];
    if (!isObject(payload)) return ['Le body doit etre un objet JSON'];

    pushRequiredString(errors, payload, 'nom_article');
    pushRequiredString(errors, payload, 'nom_marque');
    pushRequiredNumber(errors, payload, 'prix_ht', 0);
    pushRequiredNumber(errors, payload, 'prix_ttc', 0);
    pushRequiredNumber(errors, payload, 'titrage', 0);
    pushRequiredNumber(errors, payload, 'volume', 1);

    pushOptionalString(errors, payload, 'couleur');
    pushOptionalString(errors, payload, 'type');
    pushOptionalNumber(errors, payload, 'stock', 0);

    return errors;
}

export function validateUpdateBeerPayload(payload) {
    const errors = [];
    if (!isObject(payload)) return ['Le body doit etre un objet JSON'];

    pushOptionalString(errors, payload, 'nom_article');
    pushOptionalString(errors, payload, 'nom_marque');
    pushOptionalString(errors, payload, 'couleur');
    pushOptionalString(errors, payload, 'type');
    pushOptionalNumber(errors, payload, 'prix_ht', 0);
    pushOptionalNumber(errors, payload, 'prix_ttc', 0);
    pushOptionalNumber(errors, payload, 'titrage', 0);
    pushOptionalNumber(errors, payload, 'volume', 1);
    pushOptionalNumber(errors, payload, 'stock', 0);

    return errors;
}
