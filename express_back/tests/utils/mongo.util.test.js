import test from 'node:test';
import assert from 'node:assert/strict';
import { isValidObjectId } from '../../src/utils/mongo.util.js';

test('isValidObjectId validates mongo ids', () => {
    assert.equal(isValidObjectId('507f1f77bcf86cd799439011'), true);
    assert.equal(isValidObjectId('not-an-object-id'), false);
});
