import test from 'node:test';
import cartRouter from '../../src/routes/cart.routes.js';
import { assertRoute } from '../helpers/router.helper.js';

test('cart routes: endpoints exposes', () => {
    assertRoute(cartRouter, 'get', '/:cartId', 1);
    assertRoute(cartRouter, 'post', '/:cartId/items', 2);
    assertRoute(cartRouter, 'put', '/:cartId/items/:beerId', 2);
    assertRoute(cartRouter, 'delete', '/:cartId/items/:beerId', 1);
    assertRoute(cartRouter, 'delete', '/:cartId', 1);
    assertRoute(cartRouter, 'post', '/:cartId/checkout', 2);
});
