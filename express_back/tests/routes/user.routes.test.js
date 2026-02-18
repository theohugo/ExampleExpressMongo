import test from 'node:test';
import userRouter from '../../src/routes/user.routes.js';
import { assertRoute } from '../helpers/router.helper.js';

test('user routes: endpoints exposes', () => {
    assertRoute(userRouter, 'get', '/', 1);
    assertRoute(userRouter, 'get', '/stats', 1);
    assertRoute(userRouter, 'get', '/:id', 1);
    assertRoute(userRouter, 'post', '/', 2);
    assertRoute(userRouter, 'put', '/:id', 2);
    assertRoute(userRouter, 'delete', '/:id', 1);
});
