import test from 'node:test';
import orderRouter from '../../src/routes/order.routes.js';
import { assertRoute } from '../helpers/router.helper.js';

test('order routes: endpoints exposes', () => {
    assertRoute(orderRouter, 'get', '/', 1);
    assertRoute(orderRouter, 'get', '/stats', 1);
    assertRoute(orderRouter, 'get', '/seller', 2);
    assertRoute(orderRouter, 'get', '/client', 2);
    assertRoute(orderRouter, 'get', '/:id', 1);
    assertRoute(orderRouter, 'post', '/', 2);
    assertRoute(orderRouter, 'patch', '/:id/status', 2);
});
