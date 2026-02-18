import express from 'express';
import beerController from '../controllers/beer.controller.js';
import { requireRole } from '../middlewares/role.middleware.js';

const beerRouter = express.Router();

// GET /api/beers
beerRouter.get('/', beerController.getAll);

// GET /api/beers/stats
beerRouter.get('/stats', beerController.getStats);

// POST /api/beers
beerRouter.post('/', requireRole('VENDEUR'), beerController.create);

// PUT /api/beers/:id
beerRouter.put('/:id', requireRole('VENDEUR'), beerController.update);

// GET /api/beers/:id
beerRouter.get('/:id', beerController.getById);

export default beerRouter;
