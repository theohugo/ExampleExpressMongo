import test from 'node:test';
import assert from 'node:assert/strict';
import orderBuilderService from '../../src/service/orderBuilder.service.js';
import Beer from '../../src/model/beer.model.js';

const VALID_ID_1 = '507f1f77bcf86cd799439011';
const VALID_ID_2 = '507f1f77bcf86cd799439012';
const SELLER_ID = '507f1f77bcf86cd799439013';

test('orderBuilder.validateCustomer', () => {
    assert.equal(orderBuilderService.validateCustomer({ name: 'A', address: 'B' }), true);
    assert.equal(orderBuilderService.validateCustomer({ name: 'A' }), false);
    assert.equal(orderBuilderService.validateCustomer(null), false);
});

test('orderBuilder.buildOrderLines throws BAD_ITEMS when empty', async () => {
    await assert.rejects(
        () => orderBuilderService.buildOrderLines([]),
        (err) => err.code === 'BAD_ITEMS'
    );
});

test('orderBuilder.buildOrderLines throws BAD_BEER_ID when invalid id', async () => {
    await assert.rejects(
        () => orderBuilderService.buildOrderLines([{ beerId: 'bad-id', quantity: 1 }]),
        (err) => err.code === 'BAD_BEER_ID'
    );
});

test('orderBuilder.buildOrderLines throws BAD_QTY when invalid quantity', async () => {
    await assert.rejects(
        () => orderBuilderService.buildOrderLines([{ beerId: VALID_ID_1, quantity: 0 }]),
        (err) => err.code === 'BAD_QTY'
    );
});

test('orderBuilder.buildOrderLines throws MISSING_BEER when beers not found', async () => {
    const originalFind = Beer.find;
    Beer.find = async () => [];

    try {
        await assert.rejects(
            () => orderBuilderService.buildOrderLines([{ beerId: VALID_ID_1, quantity: 1 }]),
            (err) => err.code === 'MISSING_BEER'
        );
    } finally {
        Beer.find = originalFind;
    }
});

test('orderBuilder.buildOrderLines aggregates lines and computes total', async () => {
    const originalFind = Beer.find;
    Beer.find = async () => ([
        { _id: VALID_ID_1, vendeur: SELLER_ID, nom_article: 'IPA', prix_15: 3.5 },
        { _id: VALID_ID_2, vendeur: SELLER_ID, nom_article: 'Lager', prix_15: 2.0 },
    ]);

    try {
        const result = await orderBuilderService.buildOrderLines([
            { beerId: VALID_ID_1, quantity: 2 },
            { beerId: VALID_ID_1, quantity: 1 },
            { beerId: VALID_ID_2, quantity: 2 },
        ]);

        assert.equal(result.items.length, 2);

        const ipaLine = result.items.find((item) => String(item.beer) === VALID_ID_1);
        const lagerLine = result.items.find((item) => String(item.beer) === VALID_ID_2);

        assert.equal(ipaLine.quantity, 3);
        assert.equal(ipaLine.lineTotal, 10.5);
        assert.equal(lagerLine.quantity, 2);
        assert.equal(lagerLine.lineTotal, 4.0);
        assert.equal(result.totalAmount, 14.5);
    } finally {
        Beer.find = originalFind;
    }
});
