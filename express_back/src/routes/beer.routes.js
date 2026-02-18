import express from 'express';
import beerController from '../controllers/beer.controller.js';

const beerRouter = express.Router();

// GET /api/beers
beerRouter.get('/', beerController.getAll);

// GET /api/beers/stats
beerRouter.get('/stats', beerController.getStats);

// GET /api/beers/:id
beerRouter.get('/:id', beerController.getById);

export default beerRouter;
