import express from 'express';
import cartController from '../controllers/cart.controller.js';

const cartRouter = express.Router();

// GET /api/carts/:cartId
cartRouter.get('/:cartId', cartController.getCart);

// POST /api/carts/:cartId/items
cartRouter.post('/:cartId/items', cartController.addItem);

// PUT /api/carts/:cartId/items/:beerId
cartRouter.put('/:cartId/items/:beerId', cartController.setItemQuantity);

// DELETE /api/carts/:cartId/items/:beerId
cartRouter.delete('/:cartId/items/:beerId', cartController.removeItem);

// DELETE /api/carts/:cartId
cartRouter.delete('/:cartId', cartController.clear);

// POST /api/carts/:cartId/checkout
cartRouter.post('/:cartId/checkout', cartController.checkout);

export default cartRouter;
