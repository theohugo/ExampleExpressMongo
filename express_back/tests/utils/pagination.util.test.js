import test from 'node:test';
import assert from 'node:assert/strict';
import { parsePagination } from '../../src/utils/pagination.util.js';

test('parsePagination uses defaults', () => {
    const result = parsePagination({});
    assert.deepEqual(result, { page: 1, limit: 20 });
});

test('parsePagination clamps page and limit', () => {
    const result = parsePagination({ page: -2, limit: 999 });
    assert.deepEqual(result, { page: 1, limit: 100 });
});

test('parsePagination supports custom options', () => {
    const result = parsePagination({}, { defaultPage: 3, defaultLimit: 10, maxLimit: 50 });
    assert.deepEqual(result, { page: 3, limit: 10 });
});
