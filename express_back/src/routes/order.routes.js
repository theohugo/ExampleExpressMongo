import express from 'express';
import orderController from '../controllers/order.controller.js';
import { requireRole } from '../middlewares/role.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { validateCreateOrderPayload, validateUpdateOrderStatusPayload } from '../validators/order.validator.js';

const orderRouter = express.Router();

// GET /api/orders
orderRouter.get('/', orderController.getAll);

// GET /api/orders/stats
orderRouter.get('/stats', orderController.getStats);

// GET /api/orders/seller
orderRouter.get('/seller', requireRole('VENDEUR'), orderController.getSellerOrders);

// GET /api/orders/client
orderRouter.get('/client', requireRole('CLIENT'), orderController.getClientOrders);

// GET /api/orders/:id
orderRouter.get('/:id', orderController.getById);

// POST /api/orders
orderRouter.post('/', validate(validateCreateOrderPayload), orderController.create);

// PATCH /api/orders/:id/status
orderRouter.patch('/:id/status', validate(validateUpdateOrderStatusPayload), orderController.updateStatus);

export default orderRouter;
