import test from 'node:test';
import assert from 'node:assert/strict';
import {
    AppError,
    ValidationAppError,
    UnauthorizedAppError,
    NotFoundAppError,
} from '../../src/errors/app.error.js';

test('AppError base properties', () => {
    const err = new AppError('boom', 418, 'TEAPOT', { x: 1 });
    assert.equal(err.message, 'boom');
    assert.equal(err.statusCode, 418);
    assert.equal(err.code, 'TEAPOT');
    assert.deepEqual(err.details, { x: 1 });
});

test('specialized AppErrors use expected defaults', () => {
    const validation = new ValidationAppError();
    assert.equal(validation.statusCode, 400);

    const unauthorized = new UnauthorizedAppError();
    assert.equal(unauthorized.statusCode, 401);

    const notFound = new NotFoundAppError();
    assert.equal(notFound.statusCode, 404);
});
