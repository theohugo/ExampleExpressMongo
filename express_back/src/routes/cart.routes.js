import express from 'express';
import cartController from '../controllers/cart.controller.js';
import { validate } from '../middlewares/validate.middleware.js';
import {
    validateAddCartItemPayload,
    validateSetCartItemQuantityPayload,
    validateCheckoutPayload,
} from '../validators/cart.validator.js';

const cartRouter = express.Router();

// GET /api/carts/:cartId
cartRouter.get('/:cartId', cartController.getCart);

// POST /api/carts/:cartId/items
cartRouter.post('/:cartId/items', validate(validateAddCartItemPayload), cartController.addItem);

// PUT /api/carts/:cartId/items/:beerId
cartRouter.put('/:cartId/items/:beerId', validate(validateSetCartItemQuantityPayload), cartController.setItemQuantity);

// DELETE /api/carts/:cartId/items/:beerId
cartRouter.delete('/:cartId/items/:beerId', cartController.removeItem);

// DELETE /api/carts/:cartId
cartRouter.delete('/:cartId', cartController.clear);

// POST /api/carts/:cartId/checkout
cartRouter.post('/:cartId/checkout', validate(validateCheckoutPayload), cartController.checkout);

export default cartRouter;
