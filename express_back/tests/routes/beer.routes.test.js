import test from 'node:test';
import beerRouter from '../../src/routes/beer.routes.js';
import { assertRoute } from '../helpers/router.helper.js';

test('beer routes: endpoints exposes', () => {
    assertRoute(beerRouter, 'get', '/', 1);
    assertRoute(beerRouter, 'get', '/stats', 1);
    assertRoute(beerRouter, 'post', '/', 3);
    assertRoute(beerRouter, 'put', '/:id', 3);
    assertRoute(beerRouter, 'get', '/:id', 1);
});
