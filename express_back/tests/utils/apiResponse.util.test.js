import test from 'node:test';
import assert from 'node:assert/strict';
import ApiResponse from '../../src/utils/apiResponse.js';
import { createMockRes } from '../helpers/http.helper.js';

test('ApiResponse.success returns status 200 by default', () => {
    const res = createMockRes();
    ApiResponse.success(res, 'ok', { a: 1 });

    assert.equal(res.statusCode, 200);
    assert.equal(res.payload.success, true);
    assert.equal(res.payload.message, 'ok');
    assert.deepEqual(res.payload.data, { a: 1 });
    assert.ok(res.payload.timestamp);
});

test('ApiResponse.created returns status 201', () => {
    const res = createMockRes();
    ApiResponse.created(res, 'created', { id: 1 });

    assert.equal(res.statusCode, 201);
    assert.equal(res.payload.success, true);
});

test('ApiResponse.error returns status and error payload', () => {
    const res = createMockRes();
    ApiResponse.error(res, 'boom', null, 500, 'STACK');

    assert.equal(res.statusCode, 500);
    assert.equal(res.payload.success, false);
    assert.equal(res.payload.error, 'STACK');
});

test('ApiResponse helpers for badRequest/notFound/unauthorized', () => {
    const badRes = createMockRes();
    ApiResponse.badRequest(badRes, 'bad');
    assert.equal(badRes.statusCode, 400);

    const notFoundRes = createMockRes();
    ApiResponse.notFound(notFoundRes, 'nf');
    assert.equal(notFoundRes.statusCode, 404);

    const unauthorizedRes = createMockRes();
    ApiResponse.unauthorized(unauthorizedRes, 'nope');
    assert.equal(unauthorizedRes.statusCode, 401);
});
